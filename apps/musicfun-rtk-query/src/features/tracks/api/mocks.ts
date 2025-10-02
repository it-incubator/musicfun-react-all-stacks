enum CurrentUserReaction {
  None = 0,
  Like = 1,
  Dislike = -1,
}

export const MOCK_TRACKS = [
  {
    id: '1',
    type: 'tracks',
    attributes: {
      artist: 'Headlund',
      id: '1',
      title: 'Days That Matter',
      addedAt: '2025-06-01T12:00:00Z',
      attachments: [],
      images: {
        main: [
          {
            type: 'original',
            width: 100,
            height: 100,
            fileSize: 0,
            url: 'https://unsplash.it/110/110',
          },
        ],
      },
      user: {
        id: '1',
        name: 'John Doe',
      },
      currentUserReaction: CurrentUserReaction.None,
      likesCount: 104,
      dislikesCount: 2,
      artists: [{ id: '1', name: 'John Doe' }],
      duration: 100,
    },
  },
  {
    id: '2',
    type: 'tracks',
    attributes: {
      artist: 'Stellar Wave',
      id: '2',
      title: 'Cosmic Dust',
      addedAt: '2025-06-02T12:00:00Z',
      attachments: [],
      images: {
        main: [
          {
            type: 'original',
            width: 100,
            height: 100,
            fileSize: 0,
            url: 'https://unsplash.it/111/111',
          },
        ],
      },
      user: {
        id: '2',
        name: 'Jane Smith',
      },
      currentUserReaction: CurrentUserReaction.Like,
      likesCount: 10,
      dislikesCount: 2,
      artists: [{ id: '2', name: 'Jane Smith' }],
      duration: 100,
    },
  },
  {
    id: '3',
    type: 'tracks',
    attributes: {
      artist: 'Aqua Marine',
      id: '3',
      title: 'Ocean Breath Is The Best Track Ever',
      addedAt: '2025-06-03T12:00:00Z',
      attachments: [],
      images: {
        main: [
          {
            type: 'original',
            width: 100,
            height: 100,
            fileSize: 0,
            url: 'https://unsplash.it/112/112',
          },
        ],
      },
      user: {
        id: '1',
        name: 'John Doe',
      },
      currentUserReaction: CurrentUserReaction.None,
      likesCount: 1,
      dislikesCount: 2,
      artists: [
        { id: '3', name: 'Peter Jones' },
        { id: '4', name: 'Chris Green' },
        { id: '5', name: 'John Doe' },
      ],
      duration: 100,
    },
  },
  {
    id: '4',
    type: 'tracks',
    attributes: {
      artist: 'Night Rider',
      id: '4',
      title: 'Midnight Drive',
      addedAt: '2025-06-04T12:00:00Z',
      attachments: [],
      images: {
        main: [
          {
            type: 'original',
            width: 100,
            height: 100,
            fileSize: 0,
            url: 'https://unsplash.it/113/113',
          },
        ],
      },
      user: {
        id: '3',
        name: 'Peter Jones',
      },
      currentUserReaction: CurrentUserReaction.Dislike,
      likesCount: 666,
      dislikesCount: 2,
      artists: [{ id: '4', name: 'Chris Green' }],
      duration: 100,
    },
  },
  {
    id: '5',
    type: 'tracks',
    attributes: {
      artist: 'Urban Glow',
      id: '5',
      title: 'City Lights',
      addedAt: '2025-06-05T12:00:00Z',
      attachments: [],
      images: {
        main: [
          {
            type: 'original',
            width: 100,
            height: 100,
            fileSize: 0,
            url: 'https://unsplash.it/114/114',
          },
        ],
      },
      user: {
        id: '2',
        name: 'Jane Smith',
      },
      currentUserReaction: CurrentUserReaction.Like,
      likesCount: 8,
      dislikesCount: 2,
      artists: [{ id: '5', name: 'John Doe' }],
      duration: 100,
    },
  },
  {
    id: '6',
    type: 'tracks',
    attributes: {
      artist: 'Whispering Pines',
      id: '6',
      title: 'Forest Lullaby',
      addedAt: '2025-06-06T12:00:00Z',
      attachments: [],
      images: {
        main: [
          {
            type: 'original',
            width: 100,
            height: 100,
            fileSize: 0,
            url: 'https://unsplash.it/115/115',
          },
        ],
      },
      user: {
        id: '1',
        name: 'John Doe',
      },
      currentUserReaction: CurrentUserReaction.None,
      likesCount: 1,
      dislikesCount: 2,
      duration: 100,
    },
  },
  {
    id: '7',
    type: 'tracks',
    attributes: {
      artist: 'Sandstorm',
      id: '7',
      title: 'Desert Mirage',
      addedAt: '2025-06-07T12:00:00Z',
      attachments: [],
      images: {
        main: [
          {
            type: 'original',
            width: 100,
            height: 100,
            fileSize: 0,
            url: 'https://unsplash.it/116/116',
          },
        ],
      },
      user: {
        id: '4',
        name: 'Susan Lee',
      },
      currentUserReaction: CurrentUserReaction.None,
      likesCount: 10,
      dislikesCount: 2,
      artists: [{ id: '7', name: 'John Doe' }],
      duration: 100,
    },
  },
  {
    id: '8',
    type: 'tracks',
    attributes: {
      artist: 'Altitude',
      id: '8',
      title: 'Mountain Peak',
      addedAt: '2025-06-08T12:00:00Z',
      attachments: [],
      images: {
        main: [
          {
            type: 'original',
            width: 100,
            height: 100,
            fileSize: 0,
            url: 'https://unsplash.it/117/117',
          },
        ],
      },
      user: {
        id: '3',
        name: 'Peter Jones',
      },
      currentUserReaction: CurrentUserReaction.Like,
      likesCount: 10,
      dislikesCount: 2,
      artists: [{ id: '8', name: 'John Doe' }],
      duration: 100,
    },
  },
  {
    id: '9',
    type: 'tracks',
    attributes: {
      artist: 'Water Lily',
      id: '9',
      title: 'River Flow',
      addedAt: '2025-06-09T12:00:00Z',
      attachments: [],
      images: {
        main: [
          {
            type: 'original',
            width: 100,
            height: 100,
            fileSize: 0,
            url: 'https://unsplash.it/118/118',
          },
        ],
      },
      user: {
        id: '1',
        name: 'John Doe',
      },
      currentUserReaction: CurrentUserReaction.Dislike,
      likesCount: 10,
      dislikesCount: 2,
      artists: [{ id: '10', name: 'John Doe' }],
      duration: 100,
    },
  },
  {
    id: '10',
    type: 'tracks',
    attributes: {
      artist: 'Galaxy Explorer',
      id: '10',
      title: 'Final Frontier',
      addedAt: '2025-06-10T12:00:00Z',
      attachments: [],
      images: {
        main: [
          {
            type: 'original',
            width: 100,
            height: 100,
            fileSize: 0,
            url: 'https://unsplash.it/119/119',
          },
        ],
      },
      user: {
        id: '5',
        name: 'Chris Green',
      },
      currentUserReaction: CurrentUserReaction.None,
      likesCount: 10,
      dislikesCount: 2,
      artists: [{ id: '10', name: 'John Doe' }],
      duration: 100,
    },
  },
]
