-- 003_journal — quản lý Journal trong trang quản trị /jathong.
-- Idempotent ở mức bảng (IF NOT EXISTS); không DROP/TRUNCATE. Thời gian lưu UTC.
-- Nội dung bài lưu dạng JSON có cấu trúc (cây node của trình soạn thảo), đã được
-- backend xác thực và chuẩn hóa trước khi ghi; không lưu HTML thô.

-- Quyền Journal cấp riêng cho từng nhân viên. Vai trò `admin` luôn có quyền.
ALTER TABLE admins
    ADD COLUMN can_manage_journal BOOLEAN NOT NULL DEFAULT FALSE AFTER role;

-- Ảnh đã tải lên. File nằm ở thư mục dữ liệu bền vững (JOURNAL_UPLOAD_DIR), tên file
-- ngẫu nhiên do server sinh; `original_name` chỉ để hiển thị trong thư viện ảnh.
CREATE TABLE IF NOT EXISTS journal_media (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(100) NOT NULL,
    mime_type ENUM('image/jpeg', 'image/png', 'image/webp') NOT NULL,
    byte_size INT UNSIGNED NOT NULL,
    width INT UNSIGNED NOT NULL,
    height INT UNSIGNED NOT NULL,
    original_name VARCHAR(255) NULL,
    uploaded_by BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_journal_media_file_name (file_name),
    INDEX idx_journal_media_created_at (created_at),
    CONSTRAINT fk_journal_media_uploaded_by FOREIGN KEY (uploaded_by)
        REFERENCES admins (id) ON DELETE SET NULL
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- Chuyên mục. `slug` cố định sau khi tạo (dùng cho anchor #jr-muc-<slug> trên /journal).
CREATE TABLE IF NOT EXISTS journal_categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(120) NOT NULL,
    name VARCHAR(150) NOT NULL,
    english_name VARCHAR(150) NULL,
    label VARCHAR(80) NULL,
    description VARCHAR(600) NOT NULL DEFAULT '',
    image VARCHAR(255) NULL,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0,
    version INT UNSIGNED NOT NULL DEFAULT 1,
    created_by BIGINT UNSIGNED NULL,
    updated_by BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_journal_categories_slug (slug),
    INDEX idx_journal_categories_sort (sort_order, id),
    CONSTRAINT fk_journal_categories_created_by FOREIGN KEY (created_by)
        REFERENCES admins (id) ON DELETE SET NULL,
    CONSTRAINT fk_journal_categories_updated_by FOREIGN KEY (updated_by)
        REFERENCES admins (id) ON DELETE SET NULL
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- Bài viết. Mỗi dòng giữ hai bản:
--   * bản làm việc (title, summary, cover_*, content, category_id) — trình soạn thảo ghi vào đây;
--   * bản công khai `published_data` (JSON) + `published_category_id` — chỉ đổi khi bấm
--     Xuất bản / Cập nhật bản công khai. NULL nghĩa là bài chưa xuất bản.
-- `slug` cố định sau khi tạo để URL /journal/<slug> không đổi khi sửa tiêu đề hay chuyển mục.
-- `version` tăng ở mọi lần ghi để phát hiện hai người lưu trên cùng một phiên bản.
CREATE TABLE IF NOT EXISTS journal_articles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(160) NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,

    title VARCHAR(255) NOT NULL,
    summary VARCHAR(1000) NOT NULL DEFAULT '',
    cover_image VARCHAR(255) NULL,
    cover_alt VARCHAR(255) NULL,
    content JSON NOT NULL,

    published_category_id BIGINT UNSIGNED NULL,
    published_data JSON NULL,
    published_at DATETIME NULL,
    published_updated_at DATETIME NULL,
    has_draft_changes BOOLEAN NOT NULL DEFAULT FALSE,

    version INT UNSIGNED NOT NULL DEFAULT 1,
    created_by BIGINT UNSIGNED NULL,
    updated_by BIGINT UNSIGNED NULL,
    published_by BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uq_journal_articles_slug (slug),
    INDEX idx_journal_articles_category_sort (category_id, sort_order, id),
    INDEX idx_journal_articles_published (published_category_id, sort_order, id),
    CONSTRAINT fk_journal_articles_category FOREIGN KEY (category_id)
        REFERENCES journal_categories (id) ON DELETE RESTRICT,
    CONSTRAINT fk_journal_articles_published_category FOREIGN KEY (published_category_id)
        REFERENCES journal_categories (id) ON DELETE RESTRICT,
    CONSTRAINT fk_journal_articles_created_by FOREIGN KEY (created_by)
        REFERENCES admins (id) ON DELETE SET NULL,
    CONSTRAINT fk_journal_articles_updated_by FOREIGN KEY (updated_by)
        REFERENCES admins (id) ON DELETE SET NULL,
    CONSTRAINT fk_journal_articles_published_by FOREIGN KEY (published_by)
        REFERENCES admins (id) ON DELETE SET NULL
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
