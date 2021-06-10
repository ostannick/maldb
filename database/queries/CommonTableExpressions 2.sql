#GENERATES THE VARMOD PEPTIDES
WITH RECURSIVE 
cte (id, parent, sequence, mz1_monoisotopic, missed_cleavages, MSO) AS
(
  SELECT 
		id,
        parent,
		sequence, 
		(mz1_monoisotopic
			+ ((CHAR_LENGTH(sequence) - CHAR_LENGTH(REPLACE( sequence, 'C', ''))) * 50)
            # + ((CHAR_LENGTH(sequence) - CHAR_LENGTH(REPLACE( sequence, 'C', ''))) * 50) #ADDITIONAL FIXED MODS
		) as mz1_monoisotopic,  
        missed_cleavages,
        0 AS MSO
  FROM 
		`1_plant_trypsin_dig` 
  WHERE 
        `missed_cleavages` = 0
        AND
        `met_ox_count` = 0
        
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
SELECT 