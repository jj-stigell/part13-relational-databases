CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    author text,
    blog_url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);