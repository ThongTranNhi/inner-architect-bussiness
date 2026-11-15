-- 002_admin_account_security — PIN mở khóa /jathong lưu trong MySQL và thu hồi phiên khi đổi mật khẩu.
-- Chỉ thêm bảng/cột (không DROP, không đổi dữ liệu hiện có). Tài khoản hiện có giữ nguyên.

-- Cài đặt bảo mật dùng chung. Hiện chỉ có khóa 'unlock_pin': bản băm Argon2id của PIN mở khóa.
-- `version` tăng mỗi lần đổi PIN: lượt mở khóa gắn version cũ bị từ chối ngay.
-- Khi chưa có dòng 'unlock_pin', backend dùng ADMIN_UNLOCK_PIN trong .env làm PIN khởi tạo.
CREATE TABLE IF NOT EXISTS admin_settings (
    setting_key VARCHAR(64) NOT NULL,

    value_hash VARCHAR(255) NOT NULL,

    version INT UNSIGNED NOT NULL DEFAULT 1,

    updated_by BIGINT UNSIGNED NULL,

    updated_at DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (setting_key)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- Tăng mỗi lần đổi mật khẩu. Phiên đăng nhập lưu version lúc đăng nhập; lệch version
-- nghĩa là phiên đã bị thu hồi (kể cả khi bản ghi session còn sót trong bảng sessions).
ALTER TABLE admins
    ADD COLUMN credential_version INT UNSIGNED NOT NULL DEFAULT 1 AFTER is_active;
