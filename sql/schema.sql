CREATE DATABASE congo_db;

USE congo_db;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(2,2) NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY(item_id)
);