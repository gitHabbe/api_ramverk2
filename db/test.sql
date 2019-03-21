DROP VIEW IF EXISTS `userFigureCount`;
CREATE VIEW `userFigureCount`
AS
    SELECT
        figure_name,
        user_username,
        COUNT(figure_name) as COUNT,
        SUM(value) AS MoneySpend
    FROM `figure2user`
    WHERE user_username = "a"
        and value >= 0
    GROUP BY figure_name
    -- HAVING value >= 0
;

SELECT * FROM `userFigureCount`;