import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { data, Form, href, redirect, useSubmit } from 'react-router';
import * as z from 'zod/v4';
import { STATUS_CODES } from '~/app/const';
import { getSession } from '~/app/session.server';
import { createSnippet, getSupportedLanguages } from '~/lib/http';
import type { DataWithResponseInit } from '~/types';
import {
  Button,
  CodeEditor,
  FormError,
  PageTitle,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/ui';
import { urlToSearchParamsRef } from '~/utils';
import type { Route } from './+types/snippets-new.route';

const SnippetsNewRoute = ({ loaderData }: Route.ComponentProps) => {
  const { supportedLangs = [] } = loaderData ?? {};
  const schema = useMemo(() => createSchema(supportedLangs), [...supportedLangs]);
  // todo: separate form
  const form = useForm({ resolver: zodResolver(schema) });
  const submit = useSubmit();

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = (data) => {
    submit(data, { method: 'post' });
  };

  return (
    <div className="flex w-full max-w-prose flex-col gap-2">
      <PageTitle>Create New Snippet</PageTitle>

      <Form method="post" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <Select name="language" onValueChange={(v) => form.setValue('language', v)}>
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
          <CodeEditor {...form.register('code')} placeholder="Your code goes here..."></CodeEditor>
          {form.formState.errors.code && <FormError error={form.formState.errors.code.message} />}
        </div>

        <div className="p-2">
          <Button>Create Snippet</Button>
        </div>
      </Form>
    </div>
  );
};

type LoaderResult = {
  supportedLangs?: string[];
};

export async function loader({ request }: Route.LoaderArgs): Promise<Response | DataWithResponseInit<LoaderResult>> {
  const session = await getSession(request.headers.get('Cookie'));
  const token = session.get('token');
  const ref = urlToSearchParamsRef(request.url);

  if (!token) {
    return redirect(`/login?${ref}`);
  }

  const supportedLangsResult = await getSupportedLanguages({ token });

  if (supportedLangsResult.data) {
    return data({ supportedLangs: supportedLangsResult.data });
  }

  return data({}, { status: STATUS_CODES.SERVER });
}

type ActionResult = {
  errorMessage?: string;
};

export async function action({ request }: Route.ActionArgs): Promise<Response | DataWithResponseInit<ActionResult>> {
  const session = await getSession(request.headers.get('Cookie'));
  const token = session.get('token');

  if (!token) {
    return redirect('/login');
  }

  const formData = await request.formData();
  const form = Object.fromEntries(formData);
  const supportedLangs = await getSupportedLanguages({ token });
  const parseResult = createSchema(supportedLangs.data ?? []).safeParse(form);

  if (parseResult.success) {
    const { language, code } = parseResult.data;
    const postResult = await createSnippet({ language, code, token });

    if (postResult.data) {
      return redirect(href('/snippets/:snippetId', { snippetId: postResult.data.id }));
    }

    return data({}, { status: STATUS_CODES.SERVER });
  }

  return data({}, { status: STATUS_CODES.UNPROCESSABLE_ENTITY });
}

function createSchema(langs: string[]) {
  const CreateSnippetFormSchema = z.object({
    language: z.enum(langs, 'The language must be selected'),
    code: z.string().trim().nonempty(),
  });
  return CreateSnippetFormSchema;
}

export default SnippetsNewRoute;
