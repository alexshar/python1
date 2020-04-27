SELECT 
    sum(avg)*3600*24/1024/1024/1024
FROM
    spn.historypm
WHERE
    objectType = 9 AND month = 3
        AND (pmType IN (5 , 6));

select avg from spn.historypm where objectType=1 group by objectName ;
select objectName,year from spn.historypm where objectType = 1;
select objectName as pw,avg(spn.historypm.avg) as avarage, min(spn.historypm.min) as mini, max(spn.historypm.max) as maxi from spn.historypm where pmType=4 AND month=2 AND objectType=9 group by objectName having mini>40000;
select * from spn.historypm where objectName='elan-yzc-1-PW-master0' AND month=2 AND pmType=4;

select min(year*1000000+month*10000+day*100+bin) as latest, max(year*1000000+month*10000+day*100+bin) as earliest from spn.historypm where month=3;