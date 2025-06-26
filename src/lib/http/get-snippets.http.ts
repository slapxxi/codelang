import type { Snippet } from '~/types';

const URL = 'https://codelang.vercel.app/api/snippets';

type GetSnippetsResponse<T> = {
  data: T;
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    sortBy: string[];
  };
  links: { current: string };
};

export async function getSnippets(): Promise<Snippet[]> {
  // try {
  //   const response = await fetch(URL);
  //   const json = await response.json();
  //   const { data } = json.data as GetSnippetsResponse<Snippet[]>;
  //   return data;
  // } catch (e) {
  //   throw new Error('Error fetching snippets', { cause: e });
  // }
  return data.map((item) => {
    return {
      id: item.id,
      code: item.code,
      language: item.language,
      user: item.user,
      likes: item.marks.reduce((acc, mark) => (mark.type === 'like' ? acc + 1 : acc), 0),
      dislikes: item.marks.reduce((acc, mark) => (mark.type === 'dislike' ? acc + 1 : acc), 0),
    };
  });
}

const data = [
  {
    id: '144',
    code: "console.log('test');",
    language: 'JavaScript',
    marks: [
      {
        id: '252',
        type: 'like',
        user: {
          id: '134',
          username: 'michaltest',
          role: 'user',
        },
      },
      {
        id: '253',
        type: 'like',
        user: {
          id: '142',
          username: 'ilyaxtom',
          role: 'user',
        },
      },
      {
        id: '258',
        type: 'dislike',
        user: {
          id: '158',
          username: 'test_771AS',
          role: 'user',
        },
      },
    ],
    user: {
      id: '134',
      username: 'michaltest',
      role: 'user',
    },
    comments: [
      {
        id: '199',
        content: 'test',
      },
      {
        id: '195',
        content: 'string',
      },
      {
        id: '196',
        content: 'lorem ipsum',
      },
      {
        id: '197',
        content: 'lorem ipsum',
      },
      {
        id: '198',
        content: 'test comment',
      },
      {
        id: '200',
        content: 'test 2',
      },
      {
        id: '201',
        content: 'test',
      },
      {
        id: '202',
        content: 'testttt',
      },
      {
        id: '203',
        content: 'testing',
      },
      {
        id: '204',
        content: 'testing',
      },
      {
        id: '205',
        content: 'ts',
      },
      {
        id: '206',
        content: 'lol',
      },
      {
        id: '207',
        content: 'test socket',
      },
      {
        id: '208',
        content: 'test',
      },
      {
        id: '212',
        content: 'nulll',
      },
      {
        id: '213',
        content: 'hello world',
      },
    ],
  },
  {
    id: '145',
    code: 'const a = 10000001\nconst b = "TEST"\nconst c = true\nconst d = 13',
    language: 'JavaScript',
    marks: [
      {
        id: '254',
        type: 'dislike',
        user: {
          id: '142',
          username: 'ilyaxtom',
          role: 'user',
        },
      },
      {
        id: '259',
        type: 'dislike',
        user: {
          id: '158',
          username: 'test_771AS',
          role: 'user',
        },
      },
    ],
    user: {
      id: '141',
      username: 'Test45',
      role: 'user',
    },
    comments: [],
  },
  {
    id: '146',
    code: 'const a = 5646465346',
    language: 'JavaScript',
    marks: [
      {
        id: '260',
        type: 'dislike',
        user: {
          id: '158',
          username: 'test_771AS',
          role: 'user',
        },
      },
    ],
    user: {
      id: '141',
      username: 'Test45',
      role: 'user',
    },
    comments: [],
  },
  {
    id: '147',
    code: 'const f = 978687678',
    language: 'JavaScript',
    marks: [
      {
        id: '261',
        type: 'dislike',
        user: {
          id: '158',
          username: 'test_771AS',
          role: 'user',
        },
      },
    ],
    user: {
      id: '141',
      username: 'Test45',
      role: 'user',
    },
    comments: [],
  },
  {
    id: '148',
    code: 'const a = "Hello"',
    language: 'JavaScript',
    marks: [],
    user: {
      id: '141',
      username: 'Test45',
      role: 'user',
    },
    comments: [],
  },
  {
    id: '149',
    code: 'const a = 897986',
    language: 'JavaScript',
    marks: [],
    user: {
      id: '141',
      username: 'Test45',
      role: 'user',
    },
    comments: [],
  },
  {
    id: '150',
    code: 'const fff = 987986876',
    language: 'JavaScript',
    marks: [],
    user: {
      id: '141',
      username: 'Test45',
      role: 'user',
    },
    comments: [],
  },
  {
    id: '151',
    code: '// Write your code here...',
    language: 'JavaScript',
    marks: [],
    user: {
      id: '141',
      username: 'Test45',
      role: 'user',
    },
    comments: [],
  },
  {
    id: '152',
    code: 'Ffdsfdjzxhsxgfxhgfxh',
    language: 'JavaScript',
    marks: [],
    user: {
      id: '141',
      username: 'Test45',
      role: 'user',
    },
    comments: [],
  },
  {
    id: '153',
    code: '// Write your code here... zx zx zx ',
    language: 'JavaScript',
    marks: [],
    user: {
      id: '141',
      username: 'Test45',
      role: 'user',
    },
    comments: [],
  },
  {
    id: '154',
    code: "const FormSchema = z.object({\r\n  language: z.string({\r\n    required_error: 'Please select language',\r\n  }),\r\n});",
    language: 'JavaScript',
    marks: [
      {
        id: '255',
        type: 'like',
        user: {
          id: '142',
          username: 'ilyaxtom',
          role: 'user',
        },
      },
    ],
    user: {
      id: '142',
      username: 'ilyaxtom',
      role: 'user',
    },
    comments: [],
  },
  {
    id: '155',
    code: 'int test = 0;\nchar[] test2;',
    language: 'C/C++',
    marks: [],
    user: {
      id: '134',
      username: 'michaltest',
      role: 'user',
    },
    comments: [],
  },
  {
    id: '156',
    code: 'import "fmt"\n\nfunc main() {\n  fmt.PrintLn("Hello, World!")\n}',
    language: 'Go',
    marks: [],
    user: {
      id: '134',
      username: 'michaltest',
      role: 'user',
    },
    comments: [
      {
        id: '214',
        content: 'hello world',
      },
    ],
  },
  {
    id: '159',
    code: 'let code = "hello"',
    language: 'JavaScript',
    marks: [
      {
        id: '262',
        type: 'like',
        user: {
          id: '158',
          username: 'test_771AS',
          role: 'user',
        },
      },
    ],
    user: {
      id: '158',
      username: 'test_771AS',
      role: 'user',
    },
    comments: [],
  },
];
