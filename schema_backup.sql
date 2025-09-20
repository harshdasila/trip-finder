--
-- PostgreSQL database dump
--

\restrict DrymQ27BERxjQhlgKT2fIxEFfiBkn2a6qwkDYg3dvyK6CAPiLhfnzvWDJ2TwEe4

-- Dumped from database version 17.6 (Postgres.app)
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: RequestStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RequestStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'REJECTED'
);


ALTER TYPE public."RequestStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: _trip; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._trip (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public._trip OWNER TO postgres;

--
-- Name: tf_constants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tf_constants (
    constant_id integer NOT NULL,
    constant_type text NOT NULL,
    constant_value integer NOT NULL,
    constant_max_limit integer NOT NULL,
    constant_created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    constant_updated_at timestamp(3) without time zone NOT NULL,
    constant_slug text NOT NULL
);


ALTER TABLE public.tf_constants OWNER TO postgres;

--
-- Name: tf_constants_constant_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tf_constants_constant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tf_constants_constant_id_seq OWNER TO postgres;

--
-- Name: tf_constants_constant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tf_constants_constant_id_seq OWNED BY public.tf_constants.constant_id;


--
-- Name: tf_request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tf_request (
    status public."RequestStatus" DEFAULT 'PENDING'::public."RequestStatus" NOT NULL,
    request_created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    request_id text NOT NULL,
    request_updated_at timestamp(3) without time zone NOT NULL,
    request_user_id text NOT NULL,
    trip_id text NOT NULL
);


ALTER TABLE public.tf_request OWNER TO postgres;

--
-- Name: tf_trip; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tf_trip (
    trip_created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    trip_description text,
    trip_end_date timestamp(3) without time zone NOT NULL,
    trip_id text NOT NULL,
    trip_location text NOT NULL,
    trip_max_budget integer NOT NULL,
    trip_max_people integer NOT NULL,
    trip_min_budget integer NOT NULL,
    trip_owner_id text NOT NULL,
    trip_start_date timestamp(3) without time zone NOT NULL,
    trip_title text NOT NULL,
    trip_updated_at timestamp(3) without time zone NOT NULL,
    trip_location_lat text NOT NULL,
    trip_location_lon text NOT NULL,
    trip_starting_location text NOT NULL,
    trip_starting_location_lat text NOT NULL,
    trip_starting_location_lon text NOT NULL
);


ALTER TABLE public.tf_trip OWNER TO postgres;

--
-- Name: tf_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tf_user (
    user_id text NOT NULL,
    user_name text NOT NULL,
    user_email text NOT NULL,
    user_image text,
    user_created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_updated_at timestamp(3) without time zone NOT NULL,
    user_password text,
    user_google_id text
);


ALTER TABLE public.tf_user OWNER TO postgres;

--
-- Name: tf_constants constant_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tf_constants ALTER COLUMN constant_id SET DEFAULT nextval('public.tf_constants_constant_id_seq'::regclass);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: _trip _trip_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._trip
    ADD CONSTRAINT "_trip_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: tf_constants tf_constants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tf_constants
    ADD CONSTRAINT tf_constants_pkey PRIMARY KEY (constant_id);


--
-- Name: tf_request tf_request_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tf_request
    ADD CONSTRAINT tf_request_pkey PRIMARY KEY (request_id);


--
-- Name: tf_trip tf_trip_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tf_trip
    ADD CONSTRAINT tf_trip_pkey PRIMARY KEY (trip_id);


--
-- Name: tf_user tf_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tf_user
    ADD CONSTRAINT tf_user_pkey PRIMARY KEY (user_id);


--
-- Name: _trip_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_trip_B_index" ON public._trip USING btree ("B");


--
-- Name: tf_constants_constant_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX tf_constants_constant_id_key ON public.tf_constants USING btree (constant_id);


--
-- Name: tf_constants_constant_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX tf_constants_constant_slug_key ON public.tf_constants USING btree (constant_slug);


--
-- Name: tf_request_request_user_id_trip_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX tf_request_request_user_id_trip_id_key ON public.tf_request USING btree (request_user_id, trip_id);


--
-- Name: tf_user_user_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX tf_user_user_email_key ON public.tf_user USING btree (user_email);


--
-- Name: tf_user_user_google_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX tf_user_user_google_id_key ON public.tf_user USING btree (user_google_id);


--
-- Name: _trip _trip_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._trip
    ADD CONSTRAINT "_trip_A_fkey" FOREIGN KEY ("A") REFERENCES public.tf_trip(trip_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _trip _trip_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._trip
    ADD CONSTRAINT "_trip_B_fkey" FOREIGN KEY ("B") REFERENCES public.tf_user(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tf_request tf_request_request_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tf_request
    ADD CONSTRAINT tf_request_request_user_id_fkey FOREIGN KEY (request_user_id) REFERENCES public.tf_user(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tf_request tf_request_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tf_request
    ADD CONSTRAINT tf_request_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.tf_trip(trip_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tf_trip tf_trip_trip_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tf_trip
    ADD CONSTRAINT tf_trip_trip_owner_id_fkey FOREIGN KEY (trip_owner_id) REFERENCES public.tf_user(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict DrymQ27BERxjQhlgKT2fIxEFfiBkn2a6qwkDYg3dvyK6CAPiLhfnzvWDJ2TwEe4

