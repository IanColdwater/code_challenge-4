-- Database name
-- treats

-- Document you create tables pSQL here

CREATE TABLE treat (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(32) UNIQUE,
    description TEXT,
    pic TEXT
);
