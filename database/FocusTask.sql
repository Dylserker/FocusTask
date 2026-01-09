-- Base de données
create database if not exists FocusTask
    character set utf8mb4
    collate utf8mb4_unicode_ci;
use FocusTask;

-- Table Users
create table if not exists Users (
    id int unsigned auto_increment primary key,
    email varchar(255) not null unique,
    password varchar(255) not null,
    username varchar(100) not null,
    first_name varchar(100) not null,
    last_name varchar(100) not null,
    role enum('user', 'parent', 'enfant', 'admin') not null default 'user',
    avatar_url text null
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

-- Table Tasks
create table if not exists Tasks (
    id int unsigned auto_increment primary key,
    user_id int unsigned not null,
    title varchar(255) not null,
    description text null,
    status enum('à_faire', 'en_cours', 'terminée') not null default 'à_faire',
    due_date datetime null,
    priority enum('basse', 'moyenne', 'haute') not null default 'basse',
    experience_reward int not null default 10,
    completed_at datetime null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;