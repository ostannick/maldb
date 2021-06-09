DROP TABLE `test_table`
;

#Incorporate the fixed mod shift when making the temp table

CREATE TEMPORARY TABLE `test_table`
SELECT *, (`mz1_monoisotopic` + 50) AS `mz1_shifted`
FROM `1_plant_trypsin_dig`
WHERE `missed_cleavages` <= 0
;

#Create varmod permutations for M
#Grabs all the peptides that have the char, and thus need duping
SELECT * FROM `test_table`
WHERE 
	(CHAR_LENGTH(sequence) - CHAR_LENGTH(REPLACE( sequence, 'M', ''))) > 0 
    OR 
    (CHAR_LENGTH(sequence) - CHAR_LENGTH(REPLACE( sequence, 'K', ''))) > 0
    # OR ...
;


#FOREACH PEPTIDE
##--> LOOP THRU ALL VARMODS AND CALCULATE A SUMMATIVE SHIFT


SELECT parent, sequence, mz1_shifted from test_table WHERE mz1_shifted < 3200
;

#INDEX THE MASSES SO SEARCHING IS FASTER
#CREATE INDEX `shifted_masses` 
#ON `test_table`
#(mz1_shifted)
#;

SELECT parent, sequence, mz1_shifted 
FROM test_table 
WHERE mz1_shifted
BETWEEN 1000 - 1 AND 1000 + 1
;