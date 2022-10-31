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

 Date: 25/10/2022 22:33:07
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories`  (
  `id` int NOT NULL,
  `created_at` datetime NULL DEFAULT NULL,
  `updated_at` datetime NULL DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ingredients
-- ----------------------------
DROP TABLE IF EXISTS `ingredients`;
CREATE TABLE `ingredients`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime NULL DEFAULT NULL,
  `updated_at` datetime NULL DEFAULT NULL,
  `unit` int NULL DEFAULT NULL,
  `amount` float NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for recipes
-- ----------------------------
DROP TABLE IF EXISTS `recipes`;
CREATE TABLE `recipes`  (
  `id` int NOT NULL,
  `created_at` datetime NULL DEFAULT NULL,
  `updated_at` datetime NULL DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `difficulty` int NULL DEFAULT NULL,
  `category_id` int NULL DEFAULT NULL,
  `user_id` int NULL DEFAULT NULL,
  `ingredients_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime NULL DEFAULT NULL,
  `updated_at` datetime NULL DEFAULT NULL,
  `encrypted_password` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `reset_password_token` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `reset_password_sent_at` datetime NULL DEFAULT NULL,
  `remember_created_at` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `current_sign_in_at` datetime NULL DEFAULT NULL,
  `last_sign_in_at` datetime NULL DEFAULT NULL,
  `current_sign_in_ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `last_sign_in_ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sign_in_count` int NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `password_confirmation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
