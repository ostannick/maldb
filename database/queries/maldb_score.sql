delimiter //
DROP FUNCTION IF EXISTS `MALDB_SCORE`;
CREATE FUNCTION `MALDB_SCORE` (p DECIMAL(10,9), n INT, k INT)
RETURNS INT
DETERMINISTIC
BEGIN

RETURN -LOG((factorial(n) / (factorial(k) * factorial(n-k) )) * POWER(p, k) * POWER(1-p, n-k));
END//

delimiter ; -- returns to default delimiter