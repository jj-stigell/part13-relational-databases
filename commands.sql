CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    blog_url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    username text NOT NULL
);