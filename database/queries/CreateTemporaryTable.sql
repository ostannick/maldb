DROP TEMPORARY TABLE IF EXISTS `test_table`
;

#Incorporate the fixed mod shift when making the temp table
CREATE TEMPORARY TABLE `test_table`
SELECT 
	id, 
    parent, 
    sequence, 
    `start`, 
    `end`, 
    mz1_monoisotopic, 
    missed_cleavages,
    (`mz1_monoisotopic` + 57.02146 * (CHAR_LENGTH(sequence) - CHAR_LENGTH(REPLACE( sequence, 'C', '')))) AS `mz1_shifted`
FROM `1_cow_trypsin_dig`
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

#INDEX THE MASSES SO SEARCHING IS FASTER
#CREATE INDEX `shifted_masses` 
#ON `test_table`
#(mz1_shifted)
#;

SELECT 
	id, 
    parent, 
    sequence, 
    (`mz1_monoisotopic` + 57.02146 * (CHAR_LENGTH(sequence) - CHAR_LENGTH(REPLACE( sequence, 'C', '')))) AS `mz1_shifted`,
    missed_cleavages
FROM `1_cow_trypsin_dig`
HAVING
missed_cleavages <= 1
AND
(mz1_shifted BETWEEN 1000 - 1 AND 1000 + 1
OR
mz1_shifted BETWEEN 1100 - 1 AND 1000 + 1
OR
mz1_shifted BETWEEN 1200 - 1 AND 1200 + 1
OR
mz1_shifted BETWEEN 1300 - 1 AND 1300 + 1
OR
mz1_shifted BETWEEN 1400 - 1 AND 1400 + 1
OR
mz1_shifted BETWEEN 1500 - 1 AND 1500 + 1
OR
mz1_shifted BETWEEN 1600 - 1 AND 1600 + 1
OR
mz1_shifted BETWEEN 1700 - 1 AND 1700 + 1
OR
mz1_shifted BETWEEN 1800 - 1 AND 1800 + 1
OR
mz1_shifted BETWEEN 1900 - 1 AND 1900 + 1
OR
mz1_shifted BETWEEN 2000 - 1 AND 2000 + 1
OR
mz1_shifted BETWEEN 2100 - 1 AND 2100 + 1
OR
mz1_shifted BETWEEN 2200 - 1 AND 2200 + 1
OR
mz1_shifted BETWEEN 2300 - 1 AND 2300 + 1
OR
mz1_shifted BETWEEN 2400 - 1 AND 2400 + 1)
GROUP BY
`p

;



















