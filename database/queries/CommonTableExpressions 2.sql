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
  WHERE
		mz1_monoisotopic < 3600 AND mz1_monoisotopic > 500
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

###########################################################################################################################

DROP TABLE IF EXISTS tmp_search;
CREATE TABLE tmp_search (
  mz1_monoisotopic DECIMAL(10,2)
);
INSERT INTO tmp_search VALUES (1170.260461);
INSERT INTO tmp_search VALUES (1228.382739);
INSERT INTO tmp_search VALUES (1375.483557);
INSERT INTO tmp_search VALUES (1653.520751);
INSERT INTO tmp_search VALUES (1752.469679);
INSERT INTO tmp_search VALUES (1765.517257);
INSERT INTO tmp_search VALUES (1849.43973);
INSERT INTO tmp_search VALUES (2105.47983);
INSERT INTO tmp_search VALUES (2128.467221);
INSERT INTO tmp_search VALUES (2178.484802);
INSERT INTO tmp_search VALUES (2211.44009);
INSERT INTO tmp_search VALUES (2222.209515);
INSERT INTO tmp_search VALUES (2389.285925);
INSERT INTO tmp_search VALUES (2424.412107);
INSERT INTO tmp_search VALUES (2551.361535);
INSERT INTO tmp_search VALUES (2668.518994);
INSERT INTO tmp_search VALUES (22855.366387);

############################################################################################################################

SELECT id, parent, sequence, mz1_monoisotopic, err FROM (
  SELECT 
    d.id,
    d.parent,
    d.sequence,
    d.mz1_monoisotopic,
    ABS(d.mz1_monoisotopic - s.mz1_monoisotopic) err,
    ROW_NUMBER() over (
      PARTITION BY s.mz1_monoisotopic, d.parent
      ORDER BY ABS(d.mz1_monoisotopic - s.mz1_monoisotopic), id
    ) rn
  FROM
    `name_of_table` d
    INNER JOIN tmp_search s ON
      d.mz1_monoisotopic BETWEEN s.mz1_monoisotopic - 1 AND s.mz1_monoisotopic + 1
) result WHERE rn = 1;

DROP TABLE IF EXISTS tmp_search;

##########################################################################################################################
