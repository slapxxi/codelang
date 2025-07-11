import { zodResolver } from '@hookform/resolvers/zod';
import { useId, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { data, Form, href, redirect, useSubmit } from 'react-router';
import * as z from 'zod/v4';
import { ERROR_TYPE_SERVER, STATUS_CODES } from '~/app/const';
import { getSession } from '~/app/session.server';
import { getSnippet, getSupportedLanguages, markSnippet, updateSnippet } from '~/lib/http';
import type { DataWithResponseInit, TMark, TSnippet } from '~/types';
import {
  Button,
  FormError,
  Label,
  PageTitle,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/ui';
import type { Route } from './+types/snippet-edit.route';

const SnippetEditRoute = ({ loaderData }: Route.ComponentProps) => {
  const { supportedLangs = [], snippet } = loaderData ?? {};
  const schema = useMemo(() => createSchema(supportedLangs), [...supportedLangs]);
  // todo: separate form
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      language: snippet!.language,
      code: snippet!.code,
    },
  });
  const codeId = useId();
  const submit = useSubmit();

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = (data) => {
    submit(data, { method: 'post' });
  };

  return (
    <div className="flex w-full max-w-prose flex-col gap-2">
      <PageTitle>Update Snippet</PageTitle>

      <Form method="post" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <Select name="language" onValueChange={(v) => form.setValue('language', v)} value={form.watch('language')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Language</SelectLabel>
                {supportedLangs.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {form.formState.errors.language && <FormError error={form.formState.errors.language.message} />}
        </div>

        <div className="flex flex-col gap-2 p-2">
          <Label htmlFor={codeId}>Code</Label>
          <textarea
            {...form.register('code')}
            id={codeId}
            placeholder="Your code goes here..."
            className="min-h-[150px] p-2"
          ></textarea>
          {form.formState.errors.code && <FormError error={form.formState.errors.code.message} />}
        </div>

        <div className="p-2">
          <Button>Update Snippet</Button>
        </div>
      </Form>
    </div>
  );
};

type LoaderResult = {
  snippet: TSnippet;
  supportedLangs: string[];
};

export async function loader({ params, request }: Route.LoaderArgs): Promise<Response | LoaderResult> {
  const session = await getSession(request.headers.get('Cookie'));
  const token = session.get('token');
  const user = session.get('user');

  if (!token) {
    return redirect(href('/login'));
  }

  const snippetResult = await getSnippet({ id: params.snippetId });
  const supportedLangsResult = await getSupportedLanguages({ token });

  if (snippetResult.data && supportedLangsResult.data) {
    const snippet = snippetResult.data;
    const supportedLangs = supportedLangsResult.data;

    if (snippet.user.id !== user?.id) {
      throw redirect(href('/snippets/:snippetId', { snippetId: params.snippetId }));
    }

    return { snippet, supportedLangs };
  }

  throw redirect(href('/snippets/:snippetId', { snippetId: params.snippetId }));
}

type ActionResult = {
  mark?: TMark['type'];
  errorMessage?: string;
};

export async function action({
  request,
  params,
}: Route.ActionArgs): Promise<Response | DataWithResponseInit<ActionResult>> {
  const session = await getSession(request.headers.get('Cookie'));
  const formData = await request.formData();
  const mark = formData.get('mark') as TMark['type'] | null;
  const token = session.get('token');

  if (!token) {
    return redirect(href('/login'));
  }

  if (mark) {
    const markSnippetResult = await markSnippet({ id: params.snippetId, token, mark });

    if (markSnippetResult.data) {
      return data({ ...markSnippetResult.data });
    }

    return data({ errorMessage: markSnippetResult.error.message });
  }

  const form = Object.fromEntries(formData);
  const supportedLangsResult = await getSupportedLanguages({ token });

  if (!supportedLangsResult.data) {
    const { error } = supportedLangsResult;
    return data(
      { errorMessage: error.message },
      { status: error.type === ERROR_TYPE_SERVER ? error.status : STATUS_CODES.SERVER }
    );
  }

  const parseResult = createSchema(supportedLangsResult.data).safeParse(form);

  if (parseResult.success) {
    const { language, code } = parseResult.data;
    const postResult = await updateSnippet({ id: params.snippetId, language, code, token });

    if (postResult.data) {
      throw redirect(href('/snippets/:snippetId', { snippetId: params.snippetId }));
    }
  }

  return data({}, { status: STATUS_CODES.UNPROCESSABLE_ENTITY });
}

function createSchema(langs: string[]) {
  const CreateSnippetFormSchema = z.object({
    language: z.enum(langs, 'The language must be selected'),
    code: z.string().nonempty(),
  });
  return CreateSnippetFormSchema;
}

export default SnippetEditRoute;
