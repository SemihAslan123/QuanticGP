DROP TABLE IF EXISTS events;

CREATE TABLE events (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        date DATE NOT NULL,
                        description TEXT NOT NULL,
                        image TEXT NOT NULL
);
