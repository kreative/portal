CREATE TABLE public.accounts (
	ksn bigint NOT NULL,
	fname text NOT NULL,
	lname text NOT NULL,
	email text NOT NULL,
	username text NOT NULL,
	bpassword text NOT NULL,
	created_time timestamp NULL,
	CONSTRAINT accounts_pk PRIMARY KEY (ksn),
	CONSTRAINT accounts_un UNIQUE (username)
);