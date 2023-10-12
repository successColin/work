<template>
  <div class="container">
    <div class="right-container">
      <div class="gantt-selected-info">
        <div v-if="selectedTask">
          <h2>{{ selectedTask.text }}</h2>
          <span><b>ID: </b>{{ selectedTask.id }}</span
          ><br />
          <span><b>Progress: </b> {{ progressPercentage }}</span
          ><br />
          <span><b>Start Date: </b>{{ formattedStartDate }}</span
          ><br />
          <span><b>End Date: </b>{{ formattedEndDate }}</span
          ><br />
        </div>
        <div v-else class="select-task-prompt">
          <h2>Click any task</h2>
        </div>
      </div>
      <ul class="gantt-messages">
        <li
          class="gantt-message"
          v-for="(message, index) in messages"
          v-bind:key="index"
        >
          {{ message }}
        </li>
      </ul>
    </div>
    <ApiotGantt
      ref="gantt"
      class="left-container"
      :tasks="tasks"
      @task-updated="logTaskUpdate"
      @link-updated="logLinkUpdate"
      @task-selected="selectTask"
      @onTaskDblClick="onTaskDblClick"
      @onScaleClick="onScaleClick"
    ></ApiotGantt>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      tasks: {
        data: [
          {
            id: 1,
            text: 'Task #1',
            render: 'split',
            type: 'project',
          },
          {
            id: 2,
            text: 'Task #2',
            start_date: '2020-01-20',
            duration: 3,
          },
          {
            id: 3,
            text: 'Task #3',
            start_date: '2020-03-20',
            duration: 3,
            progress: 0.4,
          },
        ],
        links: [],
      },
      messages: [],
      selectedTask: null,
    };
  },
  computed: {
    progressPercentage() {
      const taskProgress = this.selectedTask.progress;
      if (!taskProgress) {
        return '0';
      }
      return `${Math.round(+taskProgress * 100)} %`;
    },
    formattedStartDate() {
      const taskStart = this.selectedTask.start_date;
      return `${taskStart.getFullYear()} / ${
        taskStart.getMonth() + 1
      } / ${taskStart.getDate()}`;
    },
    formattedEndDate() {
      const taskEnd = this.selectedTask.end_date;
      return `${taskEnd.getFullYear()} / ${
        taskEnd.getMonth() + 1
      } / ${taskEnd.getDate()}`;
    },
  },
  mounted() {
    this.$refs.gantt.initColumn([
      { name: 'text', label: 'Task name', width: '*', tree: true },
      { name: 'start_date', label: 'Start time', align: 'center' },
      { name: 'end_date', label: 'End date', align: 'center' },
      { name: 'progress', label: 'Progress', align: 'center' },
      { name: 'add', label: '', align: 'center' },
    ]);

    setTimeout(() => {
      this.tasks.data.push({
        id: 4,
        text: 'Task #4',
        start_date: '2020-1-22',
        duration: 3,
        progress: 0.4,
        parent: 1,
      });
      this.tasks.data.push({
        id: 5,
        text: 'Task #5',
        start_date: '2020-1-26',
        duration: 3,
        progress: 0.4,
        parent: 1,
      });
      // this.tasks.data.push({
      //   id: 6,
      //   text: 'Task #5',
      //   start_date: '2020-1-26',
      //   duration: 3,
      //   progress: 0.4,
      //   parent: 3,
      // });
      this.$refs.gantt.reload();
    }, 1000);
  },
  methods: {
    addMessage(message) {
      this.messages.unshift(message);
      if (this.messages.length > 40) {
        this.messages.pop();
      }
    },

    logTaskUpdate(id, mode, task) {
      const text = task && task.text ? ` (${task.text})` : '';
      const message = `Task ${mode}: ${id} ${text}`;
      this.addMessage(message);
    },

    logLinkUpdate(id, mode, link) {
      let message = `Link ${mode}: ${id}`;
      if (link) {
        message += ` ( source: ${link.source}, target: ${link.target} )`;
      }
      this.addMessage(message);
    },
    selectTask(task) {
      this.selectedTask = task;
    },
    onTaskDblClick(task) {
      console.log(task);
    },
    onScaleClick(date) {
      console.log(date);
    },
  },
};
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
.container {
  height: 100vh;
  width: 100%;
}
.left-container {
  overflow: hidden;
  position: relative;
  height: 100%;
}
.right-container {
  border-right: 1px solid #cecece;
  float: right;
  height: 100%;
  width: 340px;
  box-shadow: 0 0 5px 2px #aaa;
  position: relative;
  z-index: 2;
}
.gantt-messages {
  list-style-type: none;
  height: 50%;
  margin: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding-left: 5px;
}
.gantt-messages > .gantt-message {
  background-color: #f4f4f4;
  box-shadow: inset 5px 0 #d69000;
  font-family: Geneva, Arial, Helvetica, sans-serif;
  font-size: 14px;
  margin: 5px 0;
  padding: 8px 0 8px 10px;
}
.gantt-selected-info {
  border-bottom: 1px solid #cecece;
  box-sizing: border-box;
  font-family: Geneva, Arial, Helvetica, sans-serif;
  height: 50%;
  line-height: 28px;
  padding: 10px;
}
.gantt-selected-info h2 {
  border-bottom: 1px solid #cecece;
}
.select-task-prompt h2 {
  color: #d9d9d9;
}
</style>
