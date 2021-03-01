DROP DATABASE IF EXISTS "swpagDB";
DROP DATABASE IF EXISTS "swpagDB-test";



CREATE DATABASE "swpagDB";

\c "swpagDB"

CREATE TABLE users (
    id SERIAL PRIMARY KEY, 
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY, 
    category TEXT NOT NULL
);

INSERT INTO categories (category) VALUES ('Board');
INSERT INTO categories (category) VALUES ('Card');
INSERT INTO categories (category) VALUES ('Dice');
INSERT INTO categories (category) VALUES ('Tile');
INSERT INTO categories (category) VALUES ('Other');

CREATE TABLE games (
    id SERIAL PRIMARY KEY, 
    game TEXT NOT NULL,
    title TEXT NOT NULL,
    category_id INTEGER REFERENCES categories
);

INSERT INTO games (game, title, category_id)
    SELECT 'Tic-Tac-Toe', 'Tic-Tac-Toe', id FROM categories WHERE category = 'Board';
INSERT INTO games (game, title, category_id)
    SELECT 'Checkers', 'Checkers (under construction)', id FROM categories WHERE category = 'Board';
INSERT INTO games (game, title, category_id)
    SELECT 'Chess', 'Chess (coming soon)', id FROM categories WHERE category = 'Board';
INSERT INTO games (game, title, category_id)
    SELECT 'Cribbage', 'Cribbage (TBA)', id FROM categories WHERE category = 'Card';
INSERT INTO games (game, title, category_id)
    SELECT 'Backgammon', 'Backgammon (TBA)', id FROM categories WHERE category = 'Dice';
INSERT INTO games (game, title, category_id)
    SELECT 'Risk', 'Risk (TBA)', id FROM categories WHERE category = 'Other';
INSERT INTO games (game, title, category_id)
    SELECT 'Global Thermonuclear War', 'Global Thermonuclear War (TBA)', id FROM categories WHERE category = 'Other';

CREATE TABLE engines (
    id SERIAL PRIMARY KEY, 
    engine TEXT NOT NULL,
    game_id INTEGER REFERENCES games,
    user_id INTEGER REFERENCES users
);



CREATE DATABASE "swpagDB-test";

\c "swpagDB-test"

CREATE TABLE users (
    id SERIAL PRIMARY KEY, 
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY, 
    category TEXT NOT NULL
);

INSERT INTO categories (category) VALUES ('Board');
INSERT INTO categories (category) VALUES ('Card');
INSERT INTO categories (category) VALUES ('Dice');
INSERT INTO categories (category) VALUES ('Tile');
INSERT INTO categories (category) VALUES ('Other');

CREATE TABLE games (
    id SERIAL PRIMARY KEY, 
    game TEXT NOT NULL,
    title TEXT NOT NULL,
    category_id INTEGER REFERENCES categories
);

INSERT INTO games (game, title, category_id)
    SELECT 'Tic-Tac-Toe', 'Tic-Tac-Toe', id FROM categories WHERE category = 'Board';
INSERT INTO games (game, title, category_id)
    SELECT 'Checkers', 'Checkers (under construction)', id FROM categories WHERE category = 'Board';
INSERT INTO games (game, title, category_id)
    SELECT 'Chess', 'Chess (coming soon)', id FROM categories WHERE category = 'Board';
INSERT INTO games (game, title, category_id)
    SELECT 'Cribbage', 'Cribbage (TBA)', id FROM categories WHERE category = 'Card';
INSERT INTO games (game, title, category_id)
    SELECT 'Backgammon', 'Backgammon (TBA)', id FROM categories WHERE category = 'Dice';
INSERT INTO games (game, title, category_id)
    SELECT 'Risk', 'Risk (TBA)', id FROM categories WHERE category = 'Other';
INSERT INTO games (game, title, category_id)
    SELECT 'Global Thermonuclear War', 'Global Thermonuclear War (TBA)', id FROM categories WHERE category = 'Other';

CREATE TABLE engines (
    id SERIAL PRIMARY KEY, 
    engine TEXT NOT NULL,
    game_id INTEGER REFERENCES games,
    user_id INTEGER REFERENCES users
);
