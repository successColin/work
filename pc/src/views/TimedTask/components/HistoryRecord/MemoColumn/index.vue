<!--  -->
<template>
  <el-table-column>
    <template slot-scope="scope">
      <el-tooltip placement="top">
        <div slot="content" v-html="scope.row.errorMsg"></div>
        <div>
          {{ scope.row.errorMsg }}
        </div>
      </el-tooltip>
    </template>
  </el-table-column>
</template>
