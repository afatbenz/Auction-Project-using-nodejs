/*
 Navicat Premium Data Transfer

 Source Server         : local
 Source Server Type    : MySQL
 Source Server Version : 100424
 Source Host           : localhost:3306
 Source Schema         : jitera

 Target Server Type    : MySQL
 Target Server Version : 100424
 File Encoding         : 65001

 Date: 31/10/2022 21:51:52
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for item
-- ----------------------------
DROP TABLE IF EXISTS `item`;
CREATE TABLE `item`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_date` datetime NULL DEFAULT NULL,
  `updated_date` datetime NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `started_price` float NULL DEFAULT NULL,
  `created_by` int NULL DEFAULT NULL,
  `status` int NULL DEFAULT NULL,
  `started_date` datetime NULL DEFAULT NULL,
  `final_price` float NULL DEFAULT NULL,
  `final_bid_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for item_bid
-- ----------------------------
DROP TABLE IF EXISTS `item_bid`;
CREATE TABLE `item_bid`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_date` datetime NULL DEFAULT NULL,
  `updated_date` datetime NULL DEFAULT NULL,
  `item_id` int NULL DEFAULT NULL,
  `bid_offer` float NULL DEFAULT NULL,
  `notes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `status` int NULL DEFAULT NULL,
  `user_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `created_date` datetime NULL DEFAULT NULL,
  `updated_date` datetime NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `password` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `reset_password_token` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `reset_password_sent_at` datetime NULL DEFAULT NULL,
  `remember_created_at` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `current_sign_in_at` datetime NULL DEFAULT NULL,
  `last_sign_in_at` datetime NULL DEFAULT NULL,
  `current_sign_in_ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `last_sign_in_ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sign_in_count` int NULL DEFAULT NULL,
  `otp_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for wallet
-- ----------------------------
DROP TABLE IF EXISTS `wallet`;
CREATE TABLE `wallet`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_date` datetime NULL DEFAULT NULL,
  `updated_date` datetime NULL DEFAULT NULL,
  `user_id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `balance` float NULL DEFAULT NULL,
  `fullname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `nik` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for wallet_transaction
-- ----------------------------
DROP TABLE IF EXISTS `wallet_transaction`;
CREATE TABLE `wallet_transaction`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `wallet_id` int NULL DEFAULT NULL,
  `user_id` int NULL DEFAULT NULL,
  `bid_id` int NULL DEFAULT NULL,
  `created_date` datetime NULL DEFAULT NULL,
  `status` int NULL DEFAULT NULL,
  `item_id` int NULL DEFAULT NULL,
  `label` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `balance` float NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
