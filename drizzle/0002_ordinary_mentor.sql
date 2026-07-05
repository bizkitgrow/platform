CREATE TABLE "leads" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"business_name" varchar(255),
	"targeted_service" varchar(100),
	"created_at" timestamp with time zone DEFAULT now()
);
