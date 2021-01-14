<template>
    <div class="admin-messages-page">
        <table>
            <thead>
                <tr>
                    <th>N</th>
                    <th>Адрес</th>
                    <th>Имя</th>
                    <th>Сообщение</th>
                    <th>Дата</th>
                    <th>Показать</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(message, index) in messages"
                    :key="'m' + index"
                >
                    <td>{{ index + 1 }}</td>
                    <td>{{ message.address }}</td>
                    <td>{{ message.username }}</td>
                    <td>{{ message.message }}</td>
                    <td>{{ message.created | date }}</td>
                    <td>
                        <input
                            type="checkbox"
                            v-model="message.visible"
                            @change="changeMessageFlags(message)"
                        >
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import moment from 'moment'

export default {
    name: 'AdminMessagesPage',
    data () {
        return {
            messages: []
        }
    },
    methods: {
        updateAdminMessagesData () {
            this.$socket.emit('getAdminMessagesData', {})
        },
        changeMessageFlags (message) {
            this.$socket.emit('changeMessageFlags', message)
        }
    },
    mounted () {
        this.updateAdminMessagesData()
    },
    sockets: {
        getAdminMessagesDataSuccess (data) {
            this.messages = data
        },
        changeMessageFlagsSuccess () {
            this.updateAdminMessagesData()
        }
    },
    filters: {
        date (value) {
            if (!value) return
            return moment(value, 'YYYY-MM-DD').format('DD.MM.YYYY');
        }
    }
}
</script>

<style lang="scss">
.admin-messages-page {
    padding-top: 20px;
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
                &:nth-child(5),
                &:nth-child(6) {
                    width: 40px;
                }
                &:nth-child(2) {
                    width: 100px;
                }
                &:nth-child(3) {
                    width: 100px;
                }
            }
            th {
                color: #228CCD;
            }
        }
    }
}
</style>
