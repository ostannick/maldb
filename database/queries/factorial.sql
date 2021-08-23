delimiter //
DROP FUNCTION IF EXISTS factorial;
CREATE FUNCTION factorial(n BIGINT)
RETURNS BIGINT
DETERMINISTIC
BEGIN
DECLARE factorial BIGINT;
SET factorial = n ;
IF n <= 0 THEN
RETURN 1;
END IF;

bucle: LOOP
SET n = n - 1 ;
IF n<1 THEN
LEAVE bucle;
END IF;
SET factorial = factorial * n ;
END LOOP bucle;

RETURN factorial;

END//

delimiter ; -- returns to default delimiter