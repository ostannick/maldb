SELECT 
	`id`, 
    `parent`, 
    `met_ox_count`,
    '1_k12_truncated_chymotrypsin_dig' AS `source`
FROM `1_k12_truncated_chymotrypsin_dig` 
WHERE `missed_cleavages` <= 1 
AND 
ABS(`mz1_monoisotopic` + 
		(58.00 * CHAR_LENGTH(`sequence`) - CHAR_LENGTH( REPLACE (`sequence`, 'C', '')))  +			#fixed modifications
        (3.00 * CHAR_LENGTH(`sequence`) - CHAR_LENGTH( REPLACE (`sequence`, 'Y', ''))) 				#fixed modifications
    - 1000) 																						#observed mass
    < 1.0																							#tolerance
    
#UNION ...