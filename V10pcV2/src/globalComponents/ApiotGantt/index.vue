<template>
  <div ref="ganttContainer"></div>
</template>

<script>
import { gantt } from 'dhtmlx-gantt';

export default {
  props: {
    tasks: {
      type: Object,
      default() {
        return { data: [], links: [] };
      },
    },
    isTreeGantt: {
      type: Boolean,
      default: false,
    },
  },

  mounted() {
    gantt.plugins({
      tooltip: true,
      auto_scheduling: true,
      marker: true,
      // quick_info: true, // 快速信息框
      // multiselect: true,// 激活多任务选择
    });

    gantt.templates.tooltip_text = (
      start,
      end,
      task,
    ) => `<p style="margin-bottom:5px"><b>名称:</b> 
        ${task.text}<p/>
        <p style="margin-bottom:5px"><b>开始时间:</b>
        ${gantt.templates.tooltip_date_format(start)}<p/>
        <p><b>结束时间:</b> 
        ${gantt.templates.tooltip_date_format(end)}<p/>`;

    // gantt.config.show_quick_info = true;

    gantt.config.date_format = '%Y-%m-%d %H:%i';
    gantt.config.duration_unit = 'day';

    // gantt.config.auto_types = true;
    // gantt.config.auto_scheduling = true;
    // gantt.config.auto_scheduling_compatibility = true;
    // gantt.locale.labels.section_split = 'Display';
    // 甘特图任务悬浮框位置
    gantt.config.tooltip_offset_x = 10;
    gantt.config.tooltip_offset_y = 30;
    // 激活列表展开（折叠）功能
    gantt.config.open_split_tasks = true;

    // 创建新事件通过点击“+”按钮打开灯箱
    gantt.config.details_on_create = false;
    // 甘特图图表宽度自适应
    gantt.config.autofit = true;
    // 新增空白列后新增项目
    gantt.config.placeholder_task = false;
    // 图表刷新后位置不变
    gantt.config.preserve_scroll = true;
    gantt.config.round_dnd_dates = true;
    // 设置甘特图表头高度
    gantt.config.scale_height = 42;
    gantt.config.bar_height = 24;
    gantt.config.row_height = 37;

    gantt.config.details_on_dblclick = false;

    gantt.config.show_tasks_outside_timescale = true;
    if (!this.isTreeGantt) {
      // 是否显示进度
      gantt.config.show_progress = false;
      // 是否显示依赖连线(取消)
      gantt.config.show_links = false;
    }

    const zoomConfig = {
      levels: [
        {
          name: 'hour',
          scale_height: 42,
          min_column_width: 42,
          scales: [
            {
              unit: 'day',
              step: 1,
              format: (date) => {
                const dateToStr = gantt.date.date_to_str('%Y-%m-%d');
                return dateToStr(date);
              },
            },
            {
              unit: 'hour',
              format: (date) => {
                const dateToStr = gantt.date.date_to_str('%H:%i');
                // let endDate = gantt.date.add(date, 3, 'hour');
                // let endDate = gantt.date.add(gantt.date.add(date, 5, 'hour'), -1, 'hour');
                return dateToStr(date);
              },
            },
          ],
        },
        {
          name: 'day',
          scale_height: 42,
          min_column_width: 80,
          scales: [
            {
              unit: 'month',
              step: 1,
              format: (date) => {
                const dateToStr = gantt.date.date_to_str('%Y-%m');
                return dateToStr(date);
              },
            },
            { unit: 'day', step: 1, format: '%d' },
          ],
        },
        {
          name: 'week',
          scale_height: 42,
          min_column_width: 130,
          scales: [
            {
              unit: 'month',
              step: 1,
              format: (date) => {
                const dateToStr = gantt.date.date_to_str('%Y');
                const dateToStr1 = gantt.date.date_to_str('%M');
                return `${dateToStr(date)}年 ${dateToStr1(date)}`;
              },
            },
            {
              unit: 'week',
              step: 1,
              format: (date) => {
                const dateToStr = gantt.date.date_to_str('%m.%d');
                const endDate = gantt.date.add(
                  gantt.date.add(date, 7, 'day'),
                  -1,
                  'day',
                );
                // const weekNum = gantt.date.date_to_str('%W')(date);
                // ${weekNum}周
                return `${dateToStr(date)} ~ ${dateToStr(endDate)}`;
              },
            },
          ],
        },
        {
          name: 'month',
          scale_height: 42,
          min_column_width: 90,
          scales: [
            // { unit: 'year', step: 1, format: '%Y' },
            {
              unit: 'quarter',
              step: 1,
              format: (date) => {
                // const dateToStr = gantt.date.date_to_str('%M');
                // const endDate = gantt.date.add(
                //   gantt.date.add(date, 3, 'month'),
                //   -1,
                //   'day',
                // );
                const dateToStr = gantt.date.date_to_str('%Y');
                const Month = Number(gantt.date.date_to_str('%n')(date));
                let quarter = '';
                if (Month === 1) {
                  quarter = '第一季度';
                } else if (Month === 4) {
                  quarter = '第二季度';
                } else if (Month === 7) {
                  quarter = '第三季度';
                } else if (Month === 10) {
                  quarter = '第四季度';
                }
                return `${dateToStr(date)}年 ${quarter}`;
              },
            },
            { unit: 'month', step: 1, format: '%M' },
          ],
        },
        {
          name: 'quarter',
          scale_height: 42,
          min_column_width: 140,
          scales: [
            { unit: 'year', step: 1, format: '%Y' },
            {
              unit: 'quarter',
              step: 1,
              format: (date) => {
                const dateToStr = gantt.date.date_to_str('%M');
                const endDate = gantt.date.add(
                  gantt.date.add(date, 3, 'month'),
                  -1,
                  'day',
                );
                const Month = Number(gantt.date.date_to_str('%n')(date));
                let quarter = '';
                if (Month === 1) {
                  quarter = '第一季度';
                } else if (Month === 4) {
                  quarter = '第二季度';
                } else if (Month === 7) {
                  quarter = '第三季度';
                } else if (Month === 10) {
                  quarter = '第四季度';
                }
                return `${quarter} ${dateToStr(date)} ~ ${dateToStr(endDate)}`;
              },
            },
          ],
        },
        {
          name: 'year',
          scale_height: 42,
          min_column_width: 30,
          scales: [
            {
              unit: 'year',
              step: 1,
              format: (date) => {
                const dateToStr = gantt.date.date_to_str('%Y');
                return `${dateToStr(date)}年`;
              },
            },
          ],
        },
      ],
      useKey: 'shiftKey',
      trigger: 'wheel',
      element: () => this.$refs.ganttContainer,
    };

    gantt.ext.zoom.init(zoomConfig);
    gantt.ext.zoom.setLevel('day');
    gantt.$zoomToFit = false;
    gantt.i18n.setLocale('cn');
    gantt.init(this.$refs.ganttContainer);
    // gantt.parse(this.tasks);

    gantt.createDataProcessor((entity, action, data, id) => {
      this.$emit(`${entity}-updated`, id, action, data);
    });
    // gantt.attachEvent('onTaskSelected', (id) => {
    //   const task = gantt.getTask(id);
    //   this.$emit('task-selected', task);
    // });

    gantt.attachEvent('onTaskClick', (id, e) => {
      const task = gantt.getTask(id);
      console.log(e.target.className);
      this.$emit(
        'task-selected',
        task,
        'gantt_task_content'.includes(e.target.className),
      );
      return true;
    });
    gantt.attachEvent('onTaskDblClick', (id) => {
      const task = gantt.getTask(id);
      this.$emit('onTaskDblClick', task);
      return true;
    });

    gantt.attachEvent('onScaleClick', (e, date) => {
      this.$emit('onScaleClick', date);
    });
    gantt.attachEvent('onBeforeTaskDrag', (id, mode) => {
      const task = gantt.getTask(id);
      if (!this.isTreeGantt) {
        if (task.__current__state__ === 1) {
          this.$emit('onBeforeTaskDrag', task, mode);
          return true;
        }
        return false;
      }
      return true;
    });

    let startTime = '';
    let enTime = '';
    gantt.attachEvent('onTaskDrag', (id, mode, task) => {
      startTime = task.start_date;
      enTime = task.end_date;
      // console.log(task.start_date, task.end_date);
    });
    gantt.attachEvent('onAfterTaskDrag', (id, mode) => {
      const task = gantt.getTask(id);
      if (startTime && enTime) {
        task.start_date = startTime;
        task.end_date = enTime;
        gantt.updateTask(id);
        if (!this.isTreeGantt) {
          this.$emit('onAfterTaskDrag', task, mode);
        }
      }
    });
  },
  activated() {
    gantt.config.start_date = '';
    gantt.config.end_date = '';
    this.$nextTick(() => {
      gantt.scrollTo(sessionStorage.ganttScrollX, sessionStorage.ganttScrollY);
    });
  },
  deactivated() {
    sessionStorage.ganttScrollX = gantt.getScrollState().x;
    sessionStorage.ganttScrollY = gantt.getScrollState().Y;
  },
  beforeDestroy() {
    gantt.config.start_date = '';
    gantt.config.end_date = '';
  },
  methods: {
    initColumn(columns) {
      //   [
      //   { name: 'text', label: 'Task name', width: '*' },
      //   { name: 'start_date', label: 'Start time', align: 'center' },
      //   { name: 'end_date', label: 'End date', align: 'center' },
      //   { name: 'progress', label: 'Progress', align: 'center' },
      // ]
      gantt.config.columns = columns;
    },
    reload() {
      sessionStorage.ganttScrollX = gantt.getScrollState().x;
      sessionStorage.ganttScrollY = gantt.getScrollState().Y;
      gantt.clearAll();
      const dateToStrAll = gantt.date.date_to_str('%Y-%m-%d %H:%i');
      const today = new Date();
      const todayMarker = gantt.addMarker({
        start_date: today,
        text: '现在',
        css: 'today',
        title: dateToStrAll(today),
      });
      gantt.getMarker(todayMarker);
      // 数据解析
      console.log(this.tasks);
      gantt.parse(this.tasks);
      this.$nextTick(() => {
        gantt.scrollTo(
          sessionStorage.ganttScrollX,
          sessionStorage.ganttScrollY,
        );
      });
      // 刷新数据
      // this.$nextTick(() => {
      //   gantt.refreshData();
      // });
    },
    setDate(dateStr) {
      gantt.config.start_date = '';
      gantt.config.end_date = '';
      gantt.ext.zoom.setLevel(dateStr);
      // this.reload();
    },
    setTimeRange(start, end) {
      // gantt.init(this.$refs.ganttContainer, start, end);

      this.$nextTick(() => {
        gantt.config.start_date = start;
        gantt.config.end_date = end;
        gantt.render();
      });

      // console.log(start, end);
    },
    addTask(obj) {
      gantt.addTask(obj);
    },
    updateTask(id, obj) {
      const task = gantt.getTask(id);
      Object.keys(obj).forEach((key) => {
        if (key === 'start_date' || key === 'end_date') {
          obj[key] = new Date(obj[key]);
        }
        task[key] = obj[key];
      });
      gantt.updateTask(id);
    },
    deleteTask(id) {
      gantt.deleteTask(id);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~dhtmlx-gantt/codebase/dhtmlxgantt.css';
</style>
<style>
.gantt_layout_cell_border_bottom,
.gantt_layout_cell_border_top,
.gantt_layout_cell_border_left,
.gantt_layout_cell_border_right,
.gantt_scale_line {
  border-color: #e9e9e9;
}

.gantt_grid_scale,
.gantt_task_scale,
.gantt_task_vscroll {
  background-color: #f6f7fb;
}
.gantt_grid_scale,
.gantt_task_scale,
.gantt_task .gantt_task_scale .gantt_scale_cell,
.gantt_grid_scale .gantt_grid_head_cell {
  color: #808080;
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  border-color: #e9e9e9;
  /* border-bottom: 1px solid #cecece; */
}
.gantt_grid_head_cell[role='columnheader'] {
  text-align: left;
  padding-left: 20px;
}
.gantt_cell {
  padding-left: 20px;
  color: #333333 !important;
}
/* .gantt_layout_cell {
  border-left: 0 none !important;
  border-right: 0 none !important;
} */
.gantt_grid_data .gantt_row.odd:hover,
.gantt_grid_data .gantt_row:hover {
  background-color: #edf3fe;
}
.gantt_grid_data .gantt_row.gantt_selected,
.gantt_grid_data .gantt_row.odd.gantt_selected,
.gantt_task_row.gantt_selected {
  background-color: #edf3fe;
}
.gantt_task_row.gantt_selected .gantt_task_cell {
  border-right-color: #e9e9e9;
}
.gantt_task_line {
  border: 0 none;
  border-radius: 4px;
  /* position: relative; */
}
.gantt_task_line:hover::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.16);
}
.gantt_task_content {
  line-height: 24px;
}
.gantt_task_line.gantt_project {
  box-shadow: none !important;
  border: 0 none;
}
.gantt_marker {
  height: 100%;
  width: 2px;
  top: 0;
  position: absolute;
  text-align: center;
  background-color: #ea2b54;
  box-sizing: border-box;
}
.gantt_marker.today {
  background-color: #ea2b54;
}
.gantt_scale_line:nth-child(2) > div {
  color: #333 !important;
}
.gantt_scale_line:last-child > div:hover {
  background-color: #d4d9e0;
}
</style>
