SELECT 
	id, 
    parent,
    sequence,
    mz1_monoisotopic
FROM 
	(SELECT id, parent, sequence, mz1_monoisotopic FROM 1_plant_trypsin_dig WHERE mz1_monoisotopic BETWEEN 1500 AND 1550) AS T
WHERE
	id < 10000