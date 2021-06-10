WITH RECURSIVE
	cte1 AS (
			SELECT 
				id,
				parent,
				sequence,
				missed_cleavages,
				(`mz1_monoisotopic` + 57.02146 * (CHAR_LENGTH(sequence) - CHAR_LENGTH(REPLACE( sequence, 'C', '')))) AS `mz1_shifted`
            FROM 
				`1_plant_trypsin_dig`
			HAVING
				`mz1_shifted`
			BETWEEN
				1000 - 1
			AND
				1000 + 1
			)