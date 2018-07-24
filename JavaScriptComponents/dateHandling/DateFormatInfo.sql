
SELECT * FROM T_FMS_Configuration  






-- Alle haben 12 Monate 
SELECT * FROM T_SYS_Language_MonthNames
WHERE SYSMONTHS_SYSLANG_IetfLanguageTag LIKE '%de%' 
AND SYSMONTHS_GenitiveName != SYSMONTHS_Name


-- SYSMONTHS_Name
-- SYSMONTHS_LowerCaseName
-- SYSMONTHS_UpperCaseName
-- SYSMONTHS_TitleCaseName



-- I’m not a linguistic expert, so I’ll probably get this a bit wrong, 
-- but basically a genitive month name is used when there’s a number next to the month name. 
-- “1 April 2008”, using “1 of April 2008”, 

-- SYSMONTHS_GenitiveName
-- SYSMONTHS_LowerCaseGenitiveName
-- SYSMONTHS_UpperCaseGenitiveName
-- SYSMONTHS_TitleCaseGenitiveName

-- SYSMONTHS_AbbreviatedName
-- SYSMONTHS_LowerCaseAbbreviatedName
-- SYSMONTHS_UpperCaseAbbreviatedName
-- SYSMONTHS_TitleCaseAbbreviatedName

-- SYSMONTHS_AbbreviatedGenitiveName
-- SYSMONTHS_LowerCaseAbbreviatedGenitiveName
-- SYSMONTHS_UpperCaseAbbreviatedGenitiveName
-- SYSMONTHS_TitleCaseAbbreviatedGenitiveName


-- Alle haben 7 Tage
SELECT * FROM T_SYS_Language_DayNames

-- SELECT * FROM T_SYS_Language
-- SYSDAYS_Name
-- SYSDAYS_LowerCaseName
-- SYSDAYS_UpperCaseName	
-- SYSDAYS_TitleCaseName

-- SYSDAYS_AbbreviatedName
-- SYSDAYS_LowerCaseAbbreviatedName
-- SYSDAYS_UpperCaseAbbreviatedName	
-- SYSDAYS_TitleCaseAbbreviatedName

-- SYSDAYS_ShortestName
-- SYSDAYS_LowerCaseShortestName
-- SYSDAYS_UpperCaseShortestName
-- SYSDAYS_TitleCaseShortestName


SELECT 
	 SYSLANG_LCID
	,SYSLANG_EnglishName 
	,SYSLANG_CultureName
	,SYSLANG_IetfLanguageTag
	,SYSLANG_TwoLetterISOLanguageName
	,SYSLANG_FullDateTimePattern
	,SYSLANG_RFC1123Pattern
	,SYSLANG_LongDatePattern
	,SYSLANG_ShortDatePattern
	,SYSLANG_SortableDateTimePattern

	,SYSLANG_LongTimePattern 
	,SYSLANG_ShortTimePattern 
	 
	,SYSLANG_PMDesignator  
	,SYSLANG_AMDesignator 
FROM T_SYS_Language 
WHERE (1=1) 
-- AND SYSLANG_LongTimePattern LIKE '%tt%' 
-- AND LEN(SYSLANG_TwoLetterISOLanguageName) = 2 
-- AND SYSLANG_IsRightToLeft = 1 

-- Right-to-left-languages
-- Arabic, Hebrew, Urdu (Pakistan), Persian (Iran), Syriac/Aramaic (Syria), Divehi (Maldives)
-- Arabic: 420 million, Persian: 110 million, Urdu: 50.7 million, Hebrew: 9 million, Divehi: 340'00, Syriac: dead 
-- Aramaic: the common language of Judea in the first century AD, most likely a Galilean dialect 
AND SYSLANG_EnglishName  LIKE '%germ%'
