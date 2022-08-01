import { FC, useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActionIcon, Avatar, Button, Group, Paper, Text, Table, Badge } from '@mantine/core'
import {
  mdiArrowLeftBold,
  mdiArrowRightBold,
  mdiChevronTripleRight,
  mdiPencilOutline,
  mdiPlus,
} from '@mdi/js'
import { Icon } from '@mdi/react'
import api, { GameInfoModel } from '../../../Api'
import { GameColorMap, getGameStatus } from '../../../components/GameCard'
import AdminPage from '../../../components/admin/AdminPage'
import GameCreateModal from '../../../components/admin/GameCreateModal'
import dayjs from 'dayjs'

const ITEM_COUNT_PER_PAGE = 30

const Games: FC = () => {
  const [page, setPage] = useState(1)
  const [createOpened, setCreateOpened] = useState(false)
  const [games, setGames] = useState<GameInfoModel[]>()
  const navigate = useNavigate()

  games?.sort((a, b) => (new Date(b.end) < new Date(a.end) ? -1 : 1))

  useEffect(() => {
    api.edit
      .editGetGames({
        count: ITEM_COUNT_PER_PAGE,
        skip: (page - 1) * ITEM_COUNT_PER_PAGE,
      })
      .then((res) => {
        setGames(res.data)
      })
  }, [page])

  return (
    <AdminPage
      scroll
      isLoading={!games}
      headProps={{ position: 'apart' }}
      head={
        <>
          <Button leftIcon={<Icon path={mdiPlus} size={1} />} onClick={() => setCreateOpened(true)}>
            新建比赛
          </Button>
          <Group position="right">
            <ActionIcon size="lg" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              <Icon path={mdiArrowLeftBold} size={1} />
            </ActionIcon>
            <ActionIcon
              size="lg"
              disabled={games && games.length < ITEM_COUNT_PER_PAGE}
              onClick={() => setPage(page + 1)}
            >
              <Icon path={mdiArrowRightBold} size={1} />
            </ActionIcon>
          </Group>
        </>
      }
    >
      <Paper shadow="md" p="md">
        <Table>
          <thead>
            <tr>
              <th>比赛</th>
              <th>比赛时间</th>
              <th>简介</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {games &&
              games.map((game) => {
                const startTime = new Date(game.start)
                const endTime = new Date(game.end)
                const status = getGameStatus(startTime, endTime)
                const color = GameColorMap.get(status)

                return (
                  <tr key={game.id}>
                    <td>
                      <Group position="apart">
                        <Group position="left">
                          <Avatar src={game.poster} radius={0}>
                            {game.title?.at(0)}
                          </Avatar>
                          <Text weight={700}>{game.title}</Text>
                        </Group>
                        <Badge color={color}>{status}</Badge>
                      </Group>
                    </td>
                    <td>
                      <Group spacing="xs">
                        <Badge size="xs" color={color} variant="dot">
                          {dayjs(startTime).format('YYYY-MM-DD HH:mm')}
                        </Badge>
                        <Icon path={mdiChevronTripleRight} size={1} />
                        <Badge size="xs" color={color} variant="dot">
                          {dayjs(startTime).format('YYYY-MM-DD HH:mm')}
                        </Badge>
                      </Group>
                    </td>
                    <td>
                      <Text lineClamp={1} style={{ width: 'calc(50vw - 20rem)' }}>
                        {game.summary}
                      </Text>
                    </td>
                    <td>
                      <Group>
                        <ActionIcon
                          onClick={() => {
                            navigate(`/admin/games/${game.id}/info`)
                          }}
                        >
                          <Icon path={mdiPencilOutline} size={1} />
                        </ActionIcon>
                      </Group>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </Table>
      </Paper>
      <GameCreateModal
        title="新建比赛"
        centered
        size="30%"
        opened={createOpened}
        onClose={() => setCreateOpened(false)}
        onAddGame={(game) => setGames([...(games ?? []), game])}
      />
    </AdminPage>
  )
}

export default Games
