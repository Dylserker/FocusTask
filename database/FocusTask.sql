-- Base de données FocusTask
create database if not exists FocusTask
    character set utf8mb4
    collate utf8mb4_unicode_ci;

use FocusTask;

-- Table: Users
create table if not exists Users (
    id int unsigned auto_increment primary key,
    username varchar(50) not null unique,
    email varchar(100) not null unique,
    password_hash varchar(255) not null,
    first_name varchar(50),
    last_name varchar(50),
    photo_url varchar(255),
    join_date date not null default (current_date),
    level int not null default 1,
    experience_points int not null default 0,
    experience_percent int not null default 0,
    tasks_completed int not null default 0,
    current_streak int not null default 0,
    total_points int not null default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    index idx_email (email),
    index idx_username (username)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

-- Table: Tasks
create table if not exists Tasks (
    id int unsigned auto_increment primary key,
    user_id int unsigned not null,
    name varchar(200) not null,
    description text,
    difficulty enum('facile', 'moyen', 'difficile') not null default 'moyen',
    date date not null,
    completed boolean not null default false,
    completed_at timestamp null,
    deleted_at timestamp null,
    points_earned int default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    foreign key (user_id) references Users(id) on delete cascade,
    index idx_user_date (user_id, date),
    index idx_completed (completed),
    index idx_user_completed (user_id, completed),
    index idx_deleted (deleted_at)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

-- Table: Achievements
create table if not exists Achievements (
    id int unsigned auto_increment primary key,
    title varchar(100) not null,
    description text not null,
    icon varchar(10) not null,
    condition_type varchar(50) not null,
    condition_value int not null,
    points_reward int not null default 0,
    created_at timestamp default current_timestamp,
    unique key idx_title (title)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

-- Table: UserAchievements
create table if not exists UserAchievements (
    id int unsigned auto_increment primary key,
    user_id int unsigned not null,
    achievement_id int unsigned not null,
    unlocked_at timestamp default current_timestamp,
    foreign key (user_id) references Users(id) on delete cascade,
    foreign key (achievement_id) references Achievements(id) on delete cascade,
    unique key idx_user_achievement (user_id, achievement_id),
    index idx_user (user_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

-- Table: Rewards
create table if not exists Rewards (
    id int unsigned auto_increment primary key,
    title varchar(100) not null,
    description text not null,
    points_required int not null,
    icon varchar(10) default '🎁',
    created_at timestamp default current_timestamp,
    unique key idx_title (title)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

-- Table: UserRewards
create table if not exists UserRewards (
    id int unsigned auto_increment primary key,
    user_id int unsigned not null,
    reward_id int unsigned not null,
    unlocked_at timestamp default current_timestamp,
    foreign key (user_id) references Users(id) on delete cascade,
    foreign key (reward_id) references Rewards(id) on delete cascade,
    unique key idx_user_reward (user_id, reward_id),
    index idx_user (user_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

-- Table: Settings
create table if not exists Settings (
    id int unsigned auto_increment primary key,
    user_id int unsigned not null,
    notifications_enabled boolean default true,
    email_notifications boolean default false,
    sound_effects boolean default true,
    daily_reminder_time time default '09:00:00',
    theme varchar(20) default 'light',
    language varchar(10) default 'fr',
    timezone varchar(50) default 'Europe/Paris',
    daily_goal int default 5,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    foreign key (user_id) references Users(id) on delete cascade,
    unique key idx_user (user_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

-- Insertion des données de base pour Achievements
insert into Achievements (title, description, icon, condition_type, condition_value, points_reward) values
('Première Tâche', 'Créez votre première tâche', '🎯', 'tasks_created', 1, 10),
('Productif', 'Complétez 10 tâches', '⚡', 'tasks_count', 10, 50),
('Marathonien', 'Complétez 50 tâches', '🏃', 'tasks_count', 50, 150),
('Expert', 'Complétez 100 tâches', '🏆', 'tasks_count', 100, 300),
('Semaine Parfaite', 'Complétez toutes vos tâches pendant 7 jours', '⭐', 'streak', 7, 200),
('Matinal', 'Complétez une tâche avant 8h', '🌅', 'time_based', 8, 30);

-- Insertion des données de base pour Rewards
insert into Rewards (title, description, points_required, icon) values
('Starter Pack', 'Pour vos premiers pas', 50, '🎁'),
('Focus Boost', 'Restez concentré 3 jours', 150, '🎁'),
('Early Bird', 'Complétez 5 tâches avant 9h', 200, '🎁'),
('Consistency', '7 jours consécutifs', 350, '🎁');

-- Vues utiles

-- Vue pour obtenir les statistiques utilisateur
create or replace view UserStats as
select 
    u.id,
    u.username,
    u.level,
    u.experience_points,
    u.experience_percent,
    u.tasks_completed,
    u.current_streak,
    u.total_points,
    count(distinct ua.achievement_id) as achievements_unlocked,
    count(distinct ur.reward_id) as rewards_unlocked
from Users u
left join UserAchievements ua on u.id = ua.user_id
left join UserRewards ur on u.id = ur.user_id
group by u.id, u.username, u.level, u.experience_points, u.experience_percent, 
         u.tasks_completed, u.current_streak, u.total_points;

-- Vue pour obtenir les tâches du jour par utilisateur
create or replace view TodayTasks as
select 
    t.*,
    u.username,
    u.email
from Tasks t
join Users u on t.user_id = u.id
where t.date = current_date;

-- Triggers

-- Trigger pour mettre à jour les statistiques après complétion d'une tâche
delimiter //
create trigger after_task_completed
after update on Tasks
for each row
begin
    if new.completed = true and old.completed = false then
        set @points = case new.difficulty
            when 'facile' then 10
            when 'moyen' then 20
            when 'difficile' then 50
            else 10
        end;
        
        update Tasks set points_earned = @points where id = new.id;
        
        update Users 
        set tasks_completed = tasks_completed + 1,
            total_points = total_points + @points,
            experience_points = experience_points + @points
        where id = new.user_id;
    end if;
end;//
delimiter ;

delimiter //
create trigger after_user_created
after insert on Users
for each row
begin
    insert into Settings (user_id) values (new.id);
end;//
delimiter ;

-- Procédures stockées

-- Procédure pour calculer le niveau d'un utilisateur
delimiter //
create procedure CalculateUserLevel(IN p_user_id INT)
begin
    declare v_experience INT;
    declare v_new_level INT;
    declare v_exp_percent INT;
    
    select experience_points INTO v_experience FROM Users WHERE id = p_user_id;
    
    set v_new_level = FLOOR(SQRT(v_experience / 100)) + 1;
    
    set v_exp_percent = MOD(v_experience, 100);
    
    update Users 
    set level = v_new_level,
        experience_percent = v_exp_percent
    where id = p_user_id;
end;//
delimiter ;

-- Procédure pour vérifier et débloquer les succès
delimiter //
create procedure CheckAchievements(IN p_user_id INT)
begin
    insert ignore into UserAchievements (user_id, achievement_id)
    select p_user_id, a.id
    from Achievements a
    join Users u on u.id = p_user_id
    where a.condition_type = 'tasks_count'
    and u.tasks_completed >= a.condition_value;
    
    insert ignore into UserAchievements (user_id, achievement_id)
    select p_user_id, a.id
    from Achievements a
    join Users u on u.id = p_user_id
    where a.condition_type = 'streak'
    and u.current_streak >= a.condition_value;
end;//
delimiter ;

-- Procédure pour obtenir les tâches d'une semaine
delimiter //
create procedure GetWeekTasks(IN p_user_id INT, IN p_week_offset INT)
begin
    declare v_week_start date;
    declare v_week_end date;
    
    set v_week_start = date_add(
        date_sub(curdate(), interval weekday(curdate()) day),
        interval (p_week_offset * 7) day
    );
    
    set v_week_end = date_add(v_week_start, interval 6 day);
    
    select * from Tasks
    where user_id = p_user_id
    and date between v_week_start and v_week_end
    order by date asc, completed asc;
end;//
delimiter ;

-- Procédure pour calculer la série (streak) actuelle
delimiter //
create procedure CalculateStreak(IN p_user_id INT)
begin
    declare v_streak int default 0;
    declare v_current_date date;
    declare v_has_tasks boolean;
    
    set v_current_date = curdate();
    
    streak_loop: loop
        select count(*) > 0 into v_has_tasks
        from Tasks
        where user_id = p_user_id
        and date = v_current_date
        and completed = true;
        
        if v_has_tasks then
            set v_streak = v_streak + 1;
            set v_current_date = date_sub(v_current_date, interval 1 day);
        else
            leave streak_loop;
        end if;
    end loop;
    
    update Users set current_streak = v_streak where id = p_user_id;
end;//
delimiter ;

-- ============================================
-- Système de niveaux basé sur l'XP
-- ============================================
-- Formule: Niveau N nécessite N*100 XP pour passer au niveau suivant
-- XP total pour atteindre niveau N = 50 * N * (N - 1)
-- Exemples:
--   Niveau 1: 0-99 XP
--   Niveau 2: 100-299 XP (besoin de 100 XP)
--   Niveau 3: 300-599 XP (besoin de 200 XP)
--   Niveau 4: 600-999 XP (besoin de 300 XP)
-- ============================================

delimiter $$

-- Fonction pour calculer le niveau basé sur l'XP total
drop function if exists calculate_level$$
create function calculate_level(xp int) returns int
deterministic
begin
    declare level_value int;
    -- Formule inversée: niveau = (1 + sqrt(1 + 8*xp/100)) / 2
    set level_value = floor((1 + sqrt(1 + 8 * xp / 100)) / 2);
    -- Le niveau minimum est 1
    if level_value < 1 then
        set level_value = 1;
    end if;
    return level_value;
end$$

-- Fonction pour calculer l'XP total nécessaire pour atteindre un niveau
drop function if exists xp_for_level$$
create function xp_for_level(level_num int) returns int
deterministic
begin
    -- XP total pour atteindre niveau N = 50 * N * (N - 1)
    return 50 * level_num * (level_num - 1);
end$$

-- Fonction pour calculer le pourcentage de progression vers le niveau suivant
drop function if exists calculate_level_percent$$
create function calculate_level_percent(xp int) returns int
deterministic
begin
    declare current_level int;
    declare xp_for_current int;
    declare xp_for_next int;
    declare xp_in_level int;
    declare xp_needed int;
    declare percent_value int;
    
    set current_level = calculate_level(xp);
    set xp_for_current = xp_for_level(current_level);
    set xp_for_next = xp_for_level(current_level + 1);
    set xp_in_level = xp - xp_for_current;
    set xp_needed = xp_for_next - xp_for_current;
    
    if xp_needed > 0 then
        set percent_value = floor(100 * xp_in_level / xp_needed);
    else
        set percent_value = 0;
    end if;
    
    return percent_value;
end$$

-- Trigger pour mettre à jour automatiquement le niveau lors d'un UPDATE
drop trigger if exists update_user_level$$
create trigger update_user_level
before update on Users
for each row
begin
    -- Mettre à jour le niveau et le pourcentage basé sur experience_points
    if new.experience_points != old.experience_points then
        set new.level = calculate_level(new.experience_points);
        set new.experience_percent = calculate_level_percent(new.experience_points);
    end if;
end$$

-- Trigger pour initialiser le niveau lors d'un INSERT
drop trigger if exists insert_user_level$$
create trigger insert_user_level
before insert on Users
for each row
begin
    -- Initialiser le niveau et le pourcentage lors de la création
    set new.level = calculate_level(new.experience_points);
    set new.experience_percent = calculate_level_percent(new.experience_points);
end$$

delimiter ;