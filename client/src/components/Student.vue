<template>
    <section>
      <div class="card">
        <span v-if="!profile._id">
        <header class="card-header">
          <p class="card-header-title">
            Enter student information
          </p>
        </header>
        </span>
        <div class="card-content">
          <div class="content">
            <b-field>
                <b-upload v-model="photo"
                    accept="image/*"
                    @input="uploadPhoto"
                    :loading="photo.Length === 0 && !profile.photoFileName ? true : false"
                    drag-drop>
                    <img v-if="profile.photoFileName" :src="'http://localhost:3000/uploads/' + profile.photoFileName" alt="student_photo" width="200">
                    <section v-else class="section">
                        <div class="content has-text-centered">
                            <p>
                                <b-icon
                                    icon="camera"
                                    size="is-large">
                                </b-icon>
                            </p>
                            <p>Drag and drop photo</p>
                        </div>
                    </section>
                </b-upload>
            </b-field>

            <b-field>
                <b-input v-model="profile.name.first" placeholder="First Name" icon="person"></b-input>
            </b-field>

            <b-field>
                <b-input v-model="profile.name.last" placeholder="Last Name" icon="person"></b-input>
            </b-field>

            <b-field>
                <b-input v-model="profile.name.others" placeholder="Others" icon="person"></b-input>
            </b-field>

            <b-field grouped group-multiline>
            <b-field>
              <b-select v-model="profile.gender" icon="person">
                  <option disabled value="">Gender</option>
                  <option value="male" selected>Male</option>
                  <option value="female">Female</option>
              </b-select>
            </b-field>

            <b-field>
                <b-datepicker
                    placeholder="Date of Birth"
                    v-model="profile.dateOfBirth"
                    icon="today"
                    :min-date="minDate"
                    :max-date="maxDate">
                </b-datepicker>
            </b-field><br>
            </b-field>

            <b-field grouped group-multiline>
            <b-field>
              <b-select :placeholder="profile.level" v-model="profile.level" icon="school">
                  <option disabled value="">School</option>
                  <option value="junior">Junior Secondary</option>
                  <option value="senior">Senior Secondary</option>
              </b-select>
            </b-field>

            <b-field>
              <b-select v-model="profile.class_" icon="school">
                  <option disabled value="">Class</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
              </b-select>
            </b-field><br>
            </b-field>

            <b-field>
              <span v-if="!profile._id">
              <a class="button is-success" :class="{'is-loading':submitting}" @click.prevent="create">
              <b-icon icon="add"></b-icon>
              &nbsp;Add Student
              </a>
              </span>
              <span v-else>
              <a class="button is-success" :class="{'is-loading':submitting}" @click.prevent="update">
              <b-icon icon="save"></b-icon>
              &nbsp;&nbsp;Save
              </a>
              <a class="button is-danger" :class="{'is-loading':deleting}" @click.prevent="delete_">
              <b-icon icon="delete"></b-icon>
              &nbsp;&nbsp;Delete
              </a>
              </span>
            </b-field>
          </div>
        </div>
      </div>
    </section>
</template>

<script>
import bus from '../event-bus'
import API from '../api'

export default {
  name: 'student',
  props: {
    profile: {
      default: {
        name: {
          first: '',
          last: '',
          others: ''
        },
        dateOfBirth: '',
        gender: '',
        level: '',
        class_: '',
        photoFileName: ''
      },
      type: Object
    }
  },
  data () {
    const today = new Date()
    const profile = this.profile

    return {
      minDate: new Date(today.getFullYear() - 20, 0, 0),
      maxDate: new Date(today.getFullYear() - 12, 0, 0),
      submitting: false,
      deleting: false,
      profile,
      photo: []
    }
  },
  methods: {
    uploadPhoto: function () {
      API.post('uploads', this.photo[0], {
        headers: {
          'Content-Type': 'application/octet-stream'
        }
      })
      .then(response => {
        this.profile.photoFileName = response.data.name
      })
      .catch(e => {
        this.$toast.open({
          message: 'Something went wrong',
          type: 'is-danger'
        })
      })
    },
    create: function () {
      if (!this._validate(this.profile)) {
        this.$toast.open({
          message: 'All fields are required',
          type: 'is-danger'
        })
      } else this.submitting = true

      API.post('students', this.profile)
      .then(student => {
        bus.$emit('student-created', student.data)
        this.submitting = false
        this.$toast.open({
          message: 'Student record added successfully',
          type: 'is-success'
        })
      })
      .catch(e => {
        this.submitting = false
        this.$toast.open({
          message: 'Unable to add student record',
          type: 'is-danger'
        })
      })
    },
    update: function () {
      this.submitting = true

      API.put(`students/${this.profile._id}`, this.profile)
      .then(student => {
        bus.$emit('student-updated', student.data)
        this.submitting = false
        this.$toast.open({
          message: 'Student record updated successfully',
          type: 'is-success'
        })
      })
      .catch(e => {
        this.submitting = false
        this.$toast.open({
          message: 'Update not successful',
          type: 'is-danger'
        })
      })
    },
    delete_: function () {
      this.deleting = true

      API.delete(`students/${this.profile._id}`)
      .then(student => {
        API.delete(`uploads/${this.profile.photoFileName}`)
        bus.$emit('student-deleted', student.data)
        this.deleting = false
        this.$toast.open({
          message: 'Student record deleted successfully',
          type: 'is-success'
        })
      })
      .catch(e => {
        this.deleting = false
        this.$toast.open({
          message: 'Unable to delete student',
          type: 'is-danger'
        })
      })
    },
    _validate: function (data) {
      for (let attr in data) {
        if (typeof data[attr] === 'object') {
          return this._validate(data[attr])
        }
        if (!data[attr].trim()) {
          return false
        }
      }
      return true
    }
  }
}
</script>

