import vars
import tasks.brief

tasks.brief.brief_pm()
result = tasks.brief.get_object_history_pm_range('eline-yzc-p-1-PW-master', vars.INTERVAL_TYPES['day'], vars.PM_TYPES['flowrate'])
print(result)


