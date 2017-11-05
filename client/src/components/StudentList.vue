<template>
    <section>
        <h1 class="subtitle">Manage Students</h1>

        <div class="level">
          <div class="level-right">
          <div class="level-item">
          <b-field grouped group-multiline>
            <b-select v-model="perPage" :disabled="!isPaginated">
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="15">15 per page</option>
                <option value="20">20 per page</option>
            </b-select>
            <button class="button field is-danger" @click="deleteStudents"
                :style="{display: !checkedRows.length ? 'none' : 'initial'}">
                <b-icon icon="delete"></b-icon>
                <span>{{ checkedRows.length }} selected</span>
            </button>

          </b-field>
          </div>
          </div>

          <div class="level-right">
          <div class="level-item">
            <a href="#" @click.prevent="isAddComponentActive = true"><b-icon icon="add" size="is-large" type="is-primary"></b-icon></a>

            <b-modal :active.sync="isAddComponentActive" has-modal-card>
                <student></student>
            </b-modal>
          </div>
          </div>

        </div>

        <b-table
            :data="isEmpty ? [] : students"
            detailed
            :paginated="isPaginated"
            :per-page="perPage"
            :pagination-simple="isPaginationSimple"
            :default-sort-direction="defaultSortDirection"
            default-sort="['fullname', 'gender', 'created']"
            :bordered="isBordered"
            :striped="isStriped"
            :loading="isLoading"
            :mobile-cards="hasMobileCards"
            :checked-rows.sync="checkedRows"
            checkable>

            <template slot-scope="props">
              <b-table-column field="fullname" label="Full Name" sortable>
                  {{ props.row.name.last }} {{ props.row.name.first }} {{ props.row.name.others }}
              </b-table-column>

              <b-table-column label="Class">
                  <span v-if="props.row.level ===  'junior'">JS</span>
                  <span v-else>SS</span>
                  {{ props.row.class_ }}
              </b-table-column>

              <b-table-column field="gender" label="Gender" sortable>
                  {{ props.row.gender }}
              </b-table-column>

              <b-table-column field="created" label="Created" sortable>
                  {{ (new Date(props.row.createdAt)).toLocaleDateString() }}
              </b-table-column>
            </template>

            <template slot="detail" slot-scope="props">
              <student :profile="props.row"></student>
            </template>

            <template slot="empty">
                <section class="section">
                    <div class="content has-text-grey has-text-centered">
                        <p>
                            <b-icon
                                icon="sentiment_very_dissatisfied"
                                size="is-large">
                            </b-icon>
                        </p>
                        <p>No Student Record.</p>
                        <router-link to="Students" class="button"><b-icon icon="add"></b-icon><span>Add a Student</span></router-link></button>
                    </div>
                </section>
            </template>
        </b-table>
    </section>
</template>

<script>
import API from '../api'
import bus from '../event-bus'
import Student from '@/components/Student'

export default {
  components: { Student },
  data () {
    return {
      students: ['default'],
      checkedRows: [],
      isAddComponentActive: false,
      isEmpty: false,
      isBordered: true,
      isStriped: true,
      isLoading: false,
      isPaginated: true,
      isPaginationSimple: false,
      defaultSortDirection: 'asc',
      perPage: 5,
      hasMobileCards: true
    }
  },
  methods: {
    getStudents: function () {
      API.get('students?sort=-createdAt')
      .then(students => {
        this.students = students.data
        this.isLoading = false
      })
    },
    deleteStudent: function (id) {
      API.delete(`students/${id}`)
      this.students.splice(this.students.findIndex(x => x._id === id), 1)
    },
    deleteStudents: function () {
      this.isLoading = true
      for (let student of this.checkedRows) {
        this.deleteStudent(student._id)
      }
      this.$toast.open({
        message: `${this.checkedRows.length} students deleted successfully`,
        type: 'is-success'
      })
      this.checkedRows = []
      this.isLoading = false
    }
  },
  created () {
    this.isLoading = true
    this.getStudents()
    const that = this

    bus.$on('student-created', function (student) {
      that.isAddComponentActive = false
      that.students.unshift(student)
    })

    bus.$on('student-updated', function (student) {
      let foundIndex = that.students.findIndex(x => x._id === student._id)
      that.students[foundIndex] = student
    })

    bus.$on('student-deleted', function (student) {
      that.students.splice(that.students.findIndex(x => x._id === student._id), 1)
    })
  }
}
</script>

