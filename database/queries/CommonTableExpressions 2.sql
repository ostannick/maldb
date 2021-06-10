DROP TABLE IF EXISTS `name_of_table`
;

CREATE TABLE `name_of_table`
WITH RECURSIVE 
expanded(id, parent, sequence, mz1_monoisotopic, missed_cleavages, MSO) AS
(
  SELECT 
		id,
        parent,
		sequence, 
		(mz1_monoisotopic
			+ ((CHAR_LENGTH(sequence) - CHAR_LENGTH(REPLACE( sequence, 'C', ''))) * 57)
            # More fixed mods
		) as mz1_monoisotopic,  
        missed_cleavages,
        0 AS MSO
  FROM 
		`1_k12_trypsin_dig` 
  UNION ALL
  SELECT 
		id,
		parent,
		sequence,
        `mz1_monoisotopic` + 15.999 AS `mz1_monoisotopic`,
        missed_cleavages,
        MSO + 1
  FROM 
		expanded 
  WHERE 
		MSO < (CHAR_LENGTH(sequence) - CHAR_LENGTH(REPLACE( sequence, 'M', '')))
)
SELECT * FROM expanded
;

DROP TABLE IF EXISTS `unfiltered`
;

CREATE TEMPORARY TABLE `unfiltered`
SELECT id, parent, sequence, mz1_monoisotopic, MSO, MIN(1600 - mz1_monoisotopic) AS err FROM `name_of_table`  WHERE mz1_monoisotopic BETWEEN 1600 - 1 AND 1600 + 1 GROUP BY parent
UNION ALL
SELECT id, parent, sequence, mz1_monoisotopic, MSO, MIN(1700 - mz1_monoisotopic) AS err FROM `name_of_table`  WHERE mz1_monoisotopic BETWEEN 1700 - 1 AND 1700 + 1 GROUP BY parent
UNION ALL
SELECT id, parent, sequence, mz1_monoisotopic, MSO, MIN(1800 - mz1_monoisotopic) AS err FROM `name_of_table`  WHERE mz1_monoisotopic BETWEEN 1800 - 1 AND 1800 + 1 GROUP BY parent
UNION ALL
SELECT id, parent, sequence, mz1_monoisotopic, MSO, MIN(1900 - mz1_monoisotopic) AS err FROM `name_of_table`  WHERE mz1_monoisotopic BETWEEN 1900 - 1 AND 1900 + 1 GROUP BY parent
UNION ALL
SELECT id, parent, sequence, mz1_monoisotopic, MSO, MIN(2000 - mz1_monoisotopic) AS err FROM `name_of_table`  WHERE mz1_monoisotopic BETWEEN 2600 - 1 AND 2000 + 1 GROUP BY parent
UNION ALL
SELECT id, parent, sequence, mz1_monoisotopic, MSO, MIN(2100 - mz1_monoisotopic) AS err FROM `name_of_table`  WHERE mz1_monoisotopic BETWEEN 2100 - 1 AND 2100 + 1 GROUP BY parent
UNION ALL
SELECT id, parent, sequence, mz1_monoisotopic, MSO, MIN(2200 - mz1_monoisotopic) AS err FROM `name_of_table`  WHERE mz1_monoisotopic BETWEEN 2200 - 1 AND 2200 + 1 GROUP BY parent
UNION ALL
SELECT id, parent, sequence, mz1_monoisotopic, MSO, MIN(2300 - mz1_monoisotopic) AS err FROM `name_of_table`  WHERE mz1_monoisotopic BETWEEN 2300 - 1 AND 2300 + 1 GROUP BY parent
UNION ALL
SELECT id, parent, sequence, mz1_monoisotopic, MSO, MIN(2400 - mz1_monoisotopic) AS err FROM `name_of_table`  WHERE mz1_monoisotopic BETWEEN 2400 - 1 AND 2400 + 1 GROUP BY parent
UNION ALL
SELECT id, parent, sequence, mz1_monoisotopic, MSO, MIN(2500 - mz1_monoisotopic) AS err FROM `name_of_table`  WHERE mz1_monoisotopic BETWEEN 2500 - 1 AND 2500 + 1 GROUP BY parent
UNION ALL
SELECT id, parent, sequence, mz1_monoisotopic, MSO, MIN(2600 - mz1_monoisotopic) AS err FROM `name_of_table`  WHERE mz1_monoisotopic BETWEEN 2600 - 1 AND 2600 + 1 GROUP BY parent
UNION ALL
SELECT id, parent, sequence, mz1_monoisotopic, MSO, MIN(1150 - mz1_monoisotopic) AS err FROM `name_of_table`  WHERE mz1_monoisotopic BETWEEN 1150 - 1 AND 1150 + 1 GROUP BY parent
UNION ALL
SELECT id, parent, sequence, mz1_monoisotopic, MSO, MIN(1250 - mz1_monoisotopic) AS err FROM `name_of_table`  WHERE mz1_monoisotopic BETWEEN 1250 - 1 AND 1250 + 1 GROUP BY parent
;

SELECT parent, COUNT(parent) FROM `unfiltered` GROUP BY parent