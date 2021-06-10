#GENERATES THE VARMOD PEPTIDES
WITH RECURSIVE 
cte (id, parent, sequence, mz1_monoisotopic, missed_cleavages, MSO) AS
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
		`1_plant_trypsin_dig` 
  UNION ALL
  SELECT 
		id,
		parent,
		sequence,
        `mz1_monoisotopic` + 15.999 AS `mz1_monoisotopic`,
        missed_cleavages,
        MSO + 1
  FROM 
		cte 
  WHERE 
		MSO < (CHAR_LENGTH(sequence) - CHAR_LENGTH(REPLACE( sequence, 'M', '')))
)
#QUERY THE NEW EXPANDED RESULT SET
SELECT 1