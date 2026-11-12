-- 001_initial — schema khởi tạo cho tiếp nhận khách hàng và trang quản trị Customer Care.
-- Idempotent (IF NOT EXISTS); không DROP bảng/database. Thời gian lưu UTC (session time_zone = '+00:00').

-- Thông tin khách hàng gửi từ biểu mẫu website. Phone/email không UNIQUE vì một người
-- có thể gửi nhiều nhu cầu khác nhau.
CREATE TABLE IF NOT EXISTS customers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(255) NULL,
    service VARCHAR(100) NOT NULL,

    source VARCHAR(30) NOT NULL DEFAULT 'website',

    status ENUM(
        'new',
        'contacted',
        'completed'
    ) NOT NULL DEFAULT 'new',

    consent_at DATETIME NOT NULL,

    created_at DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_customers_status (status),
    INDEX idx_customers_service (service),
    INDEX idx_customers_phone (phone),
    INDEX idx_customers_created_at (created_at)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- Tài khoản nhân viên. Chỉ tạo qua script `pnpm admin:create`; không có API đăng ký công khai.
CREATE TABLE IF NOT EXISTS admins (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    username VARCHAR(100) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    display_name VARCHAR(150) NOT NULL,

    role ENUM(
        'admin',
        'customer_care'
    ) NOT NULL DEFAULT 'customer_care',

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- Session đăng nhập quản trị, dùng bởi express-mysql-session (createDatabaseTable = false).
-- Cấu trúc cột theo yêu cầu của thư viện; `expires` là Unix timestamp (giây).
CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL,
    expires INT UNSIGNED NOT NULL,
    data MEDIUMTEXT COLLATE utf8mb4_bin,
    PRIMARY KEY (session_id),
    INDEX idx_sessions_expires (expires)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_bin;
