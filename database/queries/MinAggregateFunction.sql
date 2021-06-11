SELECT 
	id, 
    parent, 
    sequence, 
    mz1_monoisotopic,
    MIN(ABS(1101 - mz1_monoisotopic)) AS err 
FROM 
	1_plant_trypsin_dig 
WHERE 
	mz1_monoisotopic 
BETWEEN 
	1100.251 - 1
AND
	1100.251 + 1
GROUP BY 
	parent;