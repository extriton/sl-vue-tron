<template>
    <div class="admin-users-page">
        <h3 class="admin-users-page__caption">Администраторы</h3>
        <table>
            <thead>
                <tr>
                    <th>N</th>
                    <th>Адрес</th>
                    <th>IPs</th>
                    <th>T</th>
                    <th>A</th>
                    <th>B</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(admin, index) in admins"
                    :key="'a' + index"
                >
                    <td>{{ index + 1 }}</td>
                    <td>{{ admin.address }}</td>
                    <td>{{ admin.ips }}</td>
                    <td>{{ admin.tickets }}</td>
                    <td>
                        <input
                            type="checkbox"
                            v-model="admin.isAdmin"
                            @change="changeUserFlags(admin)"
                        >
                    </td>
                    <td>
                        <input
                            type="checkbox"
                            v-model="admin.chatBlocked"
                            @change="changeUserFlags(admin)"
                        >
                    </td>
                </tr>
            </tbody>
        </table>
        <h3 class="admin-users-page__caption">Пользователи</h3>
        <table>
            <thead>
                <tr>
                    <th>N</th>
                    <th>Адрес</th>
                    <th>IPs</th>
                    <th>T</th>
                    <th>A</th>
                    <th>B</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(user, index) in users"
                    :key="'u' + index"
                >
                    <td>{{ index + 1 }}</td>
                    <td>{{ user.address }}</td>
                    <td>{{ user.ips }}</td>
                    <td>{{ user.tickets }}</td>
                    <td>
                        <input
                            type="checkbox"
                            v-model="user.isAdmin"
                            @change="changeUserFlags(user)"
                        >
                    </td>
                    <td>
                        <input
                            type="checkbox"
                            v-model="user.chatBlocked"
                            @change="changeUserFlags(user)"
                        >
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'AdminUsersPage',
    data () {
        return {
            allUsers: []
        }
    },
    computed: {
        admins () {
            return this.allUsers.filter(user => user.isAdmin)
        },
        users () {
            return this.allUsers.filter(user => !user.isAdmin)
        }
    },
    methods: {
        updateAdminUsersData () {
            this.$socket.emit('getAdminUsersData', {})
        },
        changeUserFlags (user) {
            this.$socket.emit('changeUserFlags', user)
        }
    },
    mounted () {
        this.updateAdminUsersData()
    },
    sockets: {
        getAdminUsersDataSuccess (data) {
            this.allUsers = data
        },
        changeUserFlagsSuccess () {
            this.updateAdminUsersData()
        }
    }
}
</script>

<style lang="scss">
.admin-users-page {
    padding-top: 20px;
    &__caption {
        text-align: left;
        color: #FA8116;
    }
    table {
        width: 100%;
        font-size: 12px;
        margin: 10px 0 30px 0;
        tr {
            width: 100%;
            th, td {
                border: 1px solid #777;
                padding: 10px 5px;
                vertical-align: middle;
                &:nth-child(1),
                &:nth-child(4),
                &:nth-child(5),
                &:nth-child(6) {
                    width: 40px;
                }
                &:nth-child(2) {
                    width: 300px;
                }
            }
            th {
                color: #228CCD;
            }
        }
    }
}
</style>
