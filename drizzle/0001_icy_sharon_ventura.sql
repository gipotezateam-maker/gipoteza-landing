CREATE TABLE `course_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`lessonId` int NOT NULL,
	`completed` int NOT NULL DEFAULT 0,
	`taskCompleted` int NOT NULL DEFAULT 0,
	`completedAt` timestamp,
	CONSTRAINT `course_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_students` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`accessToken` varchar(128) NOT NULL,
	`isPaid` int NOT NULL DEFAULT 0,
	`paymentId` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `course_students_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_students_email_unique` UNIQUE(`email`),
	CONSTRAINT `course_students_accessToken_unique` UNIQUE(`accessToken`)
);
