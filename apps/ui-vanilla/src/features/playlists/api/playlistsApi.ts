export const playlistsApi = {}

export enum CurrentUserReaction {
  None = 0,
  Like = 1,
  Dislike = 2,
}

export const MOCK_PLAYLISTS = [
  {
    data: {
      id: '1',
      type: 'playlists',
      attributes: {
        title: 'Chill Vibes',
        description: {
          text: 'Relax and unwind with these chill tracks 🌊',
        },
        addedAt: '2025-06-01T12:00:00Z',
        updatedAt: '2025-06-10T15:30:00Z',
        order: 1,
        user: {
          id: 'user-101',
          name: 'Alice',
        },
        images: {
          main: [
            {
              type: 'original',
              width: 640,
              height: 640,
              fileSize: 204800,
              url: 'https://unsplash.it/183/183',
            },
          ],
        },
        tags: ['chill', 'lofi', 'relax'],
        currentUserReaction: CurrentUserReaction.Like,
        likesCount: 542,
      },
    },
  },
  {
    data: {
      id: '2',
      type: 'playlists',
      attributes: {
        title: 'Workout Pump',
        description: {
          text: 'High energy tracks to keep you moving 💪',
        },
        addedAt: '2025-05-20T08:00:00Z',
        updatedAt: '2025-06-05T18:00:00Z',
        order: 2,
        user: {
          id: 'user-202',
          name: 'Bob',
        },
        images: {
          main: [
            {
              type: 'original',
              width: 800,
              height: 800,
              fileSize: 307200,
              url: 'https://unsplash.it/184/184',
            },
          ],
        },
        tags: ['fitness', 'pump', 'motivation'],
        currentUserReaction: CurrentUserReaction.None,
        likesCount: 123,
      },
    },
  },
  {
    data: {
      id: '3',
      type: 'playlists',
      attributes: {
        title: 'Fantasy Soundtrack',
        description: {
          text: 'Epic and magical music for your quests 🏹',
        },
        addedAt: '2025-04-15T14:30:00Z',
        updatedAt: '2025-05-01T10:10:00Z',
        order: 3,
        user: {
          id: 'user-303',
          name: 'Elrond',
        },
        images: {
          main: [
            {
              type: 'original',
              width: 1024,
              height: 768,
              fileSize: 512000,
              url: 'https://unsplash.it/185/185',
            },
          ],
        },
        tags: ['fantasy', 'soundtrack', 'epic'],
        currentUserReaction: CurrentUserReaction.None,
        likesCount: 54,
      },
    },
  },
  {
    data: {
      id: '4',
      type: 'playlists',
      attributes: {
        title: 'Suffer possible assume',
        description: {
          text: 'Recently religious responsibility whether only.',
        },
        addedAt: '2025-04-29T10:39:13',
        updatedAt: '2025-06-14T21:01:35',
        order: 4,
        user: {
          id: 'user-4',
          name: 'Katie',
        },
        images: {
          main: [
            {
              type: 'original',
              width: 936,
              height: 306,
              fileSize: 243840,
              url: 'https://unsplash.it/192/192',
            },
          ],
        },
        tags: ['any', 'shake', 'white'],
        currentUserReaction: CurrentUserReaction.Like,
        likesCount: 3,
      },
    },
  },
  {
    data: {
      id: '5',
      type: 'playlists',
      attributes: {
        title: 'Risk still',
        description: {
          text: 'Skin pay sure yeah couple live heart.',
        },
        addedAt: '2025-01-26T00:52:16',
        updatedAt: '2025-06-14T21:00:56',
        order: 5,
        user: {
          id: 'user-5',
          name: 'Robert',
        },
        images: {
          main: [
            {
              type: 'original',
              width: 525,
              height: 500,
              fileSize: 185000,
              url: 'https://unsplash.it/191/191',
            },
          ],
        },
        tags: ['term', 'item'],
        currentUserReaction: CurrentUserReaction.None,
        likesCount: 12,
      },
    },
  },
  {
    data: {
      id: '6',
      type: 'playlists',
      attributes: {
        title: 'Attack through go',
        description: {
          text: 'Plan deep sport growth tonight.',
        },
        addedAt: '2025-04-07T10:16:19',
        updatedAt: '2025-06-14T21:02:28',
        order: 6,
        user: {
          id: 'user-6',
          name: 'Shelly',
        },
        images: {
          main: [
            {
              type: 'original',
              width: 985,
              height: 44,
              fileSize: 105000,
              url: 'https://unsplash.it/190/190',
            },
          ],
        },
        tags: ['feeling', 'size'],
        currentUserReaction: CurrentUserReaction.None,
        likesCount: 0,
      },
    },
  },
  {
    data: {
      id: '7',
      type: 'playlists',
      attributes: {
        title: 'Yet woman outside',
        description: {
          text: 'Attorney especially child music capital well.',
        },
        addedAt: '2025-01-02T16:37:47',
        updatedAt: '2025-06-14T21:03:26',
        order: 7,
        user: {
          id: 'user-7',
          name: 'Kristopher',
        },
        images: {
          main: [
            {
              type: 'original',
              width: 541,
              height: 589,
              fileSize: 312000,
              url: 'https://unsplash.it/189/189',
            },
          ],
        },
        tags: ['week'],
        currentUserReaction: CurrentUserReaction.Like,
        likesCount: 12,
      },
    },
  },
  {
    data: {
      id: '8',
      type: 'playlists',
      attributes: {
        title: 'Community',
        description: {
          text: 'Visit about occur it fast industry process.',
        },
        addedAt: '2025-06-03T22:12:23',
        updatedAt: '2025-06-14T21:00:31',
        order: 8,
        user: {
          id: 'user-8',
          name: 'Kimberly',
        },
        images: {
          main: [
            {
              type: 'original',
              width: 376,
              height: 803,
              fileSize: 460000,
              url: 'https://unsplash.it/188/188',
            },
          ],
        },
        tags: ['serve', 'although', 'item'],
        currentUserReaction: CurrentUserReaction.None,
        likesCount: 12,
      },
    },
  },
  {
    data: {
      id: '9',
      type: 'playlists',
      attributes: {
        title: 'Dance Lights Forever',
        description: {
          text: 'Feel the beat drop and the lights flash 🎉',
        },
        addedAt: '2024-12-14T15:20:12',
        updatedAt: '2025-06-13T17:15:00',
        order: 9,
        user: {
          id: 'user-9',
          name: 'Jasmine',
        },
        images: {
          main: [
            {
              type: 'original',
              width: 800,
              height: 800,
              fileSize: 310000,
              url: 'https://unsplash.it/187/187',
            },
          ],
        },
        tags: ['dance', 'party', 'electro'],
        currentUserReaction: CurrentUserReaction.None,
        likesCount: 2,
      },
    },
  },
  {
    data: {
      id: '10',
      type: 'playlists',
      attributes: {
        title: 'Calm Forest Ambience',
        description: {
          text: 'Let nature help you concentrate 🌲',
        },
        addedAt: '2025-03-01T09:45:00',
        updatedAt: '2025-06-10T13:20:00',
        order: 10,
        user: {
          id: 'user-10',
          name: 'Leo',
        },
        images: {
          main: [
            {
              type: 'original',
              width: 1024,
              height: 576,
              fileSize: 280000,
              url: 'https://unsplash.it/186/186',
            },
          ],
        },
        tags: ['nature', 'focus', 'relax'],
        currentUserReaction: CurrentUserReaction.Dislike,
        likesCount: 84,
      },
    },
  },
]

export const MOCK_PLAYLIST = {
  data: {
    id: '10',
    type: 'playlists',
    attributes: {
      title: 'Calm Forest Ambience',
      description: {
        text: 'Let nature help you concentrate 🌲',
      },
      addedAt: '2025-03-01T09:45:00',
      updatedAt: '2025-06-10T13:20:00',
      order: 10,
      user: {
        id: 'user-10',
        name: 'Leo',
      },
      images: {
        main: [
          {
            type: 'original',
            width: 1024,
            height: 576,
            fileSize: 280000,
            url: 'https://unsplash.it/300/300',
          },
        ],
      },
      tags: ['nature', 'focus', 'relax'],
      currentUserReaction: CurrentUserReaction.None,
      likesCount: 12,
    },
  },
}
