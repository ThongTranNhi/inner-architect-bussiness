import { mkdirSync } from "node:fs"
import express, { type Express } from "express"
import session from "express-session"
import MySQLStoreFactory from "express-mysql-session"
import helmet from "helmet"
import type { Pool } from "mysql2/promise"
import type { CauHinh } from "./config/env.ts"
import {
  xuLyKhongTimThay,
  xuLyLoiTapTrung,
} from "./middleware/error-handler.ts"
import {
  GIOI_HAN_MAC_DINH,
  taoBoGioiHan,
  type CauHinhGioiHan,
} from "./middleware/rate-limiter.ts"
import { ganNguCanhYeuCau } from "./middleware/request-context.ts"
import { taoXuLySitemap } from "./modules/journal/journal.routes.ts"
import { taoRouterApiV1 } from "./routes/index.ts"
import { taoGhiNhatKyBaoMat } from "./utils/nhat-ky-bao-mat.ts"

/** Tên cookie session; chỉ gửi kèm đường dẫn `/api`. */
export const TEN_COOKIE_SESSION = "ia_sid"

const MySQLStore = MySQLStoreFactory(session)

/**
 * Dựng ứng dụng Express (chưa listen) để dùng cho cả server thật lẫn test.
 *
 * @param tuyChon.pool - Pool MySQL dùng cho dữ liệu và session store
 * @param tuyChon.cauHinh - Cấu hình môi trường đã kiểm tra
 * @param tuyChon.gioiHan - Ngưỡng rate limit (test truyền số nhỏ)
 * @param tuyChon.batLog - Bật log truy cập (tắt trong test)
 * @returns Ứng dụng và hàm `dong()` dừng tác vụ dọn session định kỳ
 */
export function taoUngDung(tuyChon: {
  pool: Pool
  cauHinh: CauHinh
  gioiHan?: CauHinhGioiHan
  batLog?: boolean
}): { app: Express; dong: () => Promise<void> } {
  const { pool, cauHinh } = tuyChon
  const laProduction = cauHinh.NODE_ENV === "production"
  const thoiHanMs = cauHinh.SESSION_MAX_AGE_HOURS * 60 * 60 * 1000

  const kho = new MySQLStore(
    {
      createDatabaseTable: false,
      clearExpired: true,
      checkExpirationInterval: 15 * 60 * 1000,
      expiration: thoiHanMs,
    },
    // express-mysql-session v3 dùng chung pool mysql2/promise (không tự mở pool riêng).
    pool as unknown as ConstructorParameters<typeof MySQLStore>[1],
  )

  const app = express()
  app.disable("x-powered-by")
  // Sau Nginx trên VPS: tin đúng một proxy để req.ip / cookie secure chính xác.
  app.set("trust proxy", cauHinh.TRUST_PROXY ? 1 : false)

  app.use(ganNguCanhYeuCau(tuyChon.batLog ?? true))
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      xFrameOptions: { action: "sameorigin" },
      xContentTypeOptions: true,
    }),
  )

  const middlewareSession = session({
    name: TEN_COOKIE_SESSION,
    secret: cauHinh.SESSION_SECRET,
    store: kho,
    resave: false,
    saveUninitialized: false,
    rolling: false,
    cookie: {
      httpOnly: true,
      secure: laProduction,
      sameSite: "strict",
      maxAge: thoiHanMs,
      path: "/api",
    },
  })

  // Ảnh Journal: tên file ngẫu nhiên, không đổi → cache dài hạn. Production nên để Nginx
  // phục vụ trực tiếp thư mục này (xem docs/backend/deployment.md); route này là dự phòng/dev.
  mkdirSync(cauHinh.JOURNAL_UPLOAD_DIR, { recursive: true })
  app.use(
    "/media/journal",
    express.static(cauHinh.JOURNAL_UPLOAD_DIR, {
      index: false,
      dotfiles: "deny",
      immutable: true,
      maxAge: "365d",
      redirect: false,
    }),
  )
  app.get("/sitemap.xml", taoXuLySitemap(pool, cauHinh.SITE_URL))

  app.use(
    "/api/v1",
    taoRouterApiV1({
      pool,
      session: middlewareSession,
      tenCookie: TEN_COOKIE_SESSION,
      gioiHan: taoBoGioiHan(tuyChon.gioiHan ?? GIOI_HAN_MAC_DINH),
      originChoPhep: cauHinh.ALLOWED_ORIGINS,
      pinKhoiTao: cauHinh.ADMIN_UNLOCK_PIN,
      ghiNhatKyBaoMat: taoGhiNhatKyBaoMat(tuyChon.batLog ?? true),
      thuMucAnhJournal: cauHinh.JOURNAL_UPLOAD_DIR,
      dungLuongAnhToiDa: cauHinh.JOURNAL_MAX_UPLOAD_MB * 1024 * 1024,
    }),
  )
  app.use(xuLyKhongTimThay)
  app.use(xuLyLoiTapTrung)

  return { app, dong: () => kho.close() }
}
