CREATE TABLE `highscore` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `firstname` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
    `lastname` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
    `points` INT(11) NULL DEFAULT NULL,
    PRIMARY KEY (`id`) USING BTREE
)
    COLLATE='utf8mb4_general_ci'
    ENGINE=InnoDB
    AUTO_INCREMENT=1
;
