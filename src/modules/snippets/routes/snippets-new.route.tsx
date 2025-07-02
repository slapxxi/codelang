import { data, Form, href, redirect, useSubmit } from 'react-router';
import { getSession } from '~/app/session.server';
import { createSnippet, getSupportedLanguages } from '~/lib/http';
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
import type { Route } from './+types/snippets-new.route';
import { useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod/v4';
import { useId, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

const SnippetsNewRoute = ({ loaderData }: Route.ComponentProps) => {
  const { supportedLangs = [], error } = loaderData ?? {};
  const schema = useMemo(() => createSchema(supportedLangs), [...supportedLangs]);
  const form = useForm({ resolver: zodResolver(schema) });
  const codeId = useId();
  const submit = useSubmit();

  if (error) {
    return null;
  }

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = (data) => {
    submit(data, { method: 'post' });
  };

  return (
    <div className="w-full flex flex-col gap-2 max-w-prose">
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
          <Label htmlFor={codeId}>Code</Label>
          <textarea {...form.register('code')} id={codeId} placeholder="Your code goes here..."></textarea>
          {form.formState.errors.code && <FormError error={form.formState.errors.code.message} />}
        </div>

        <div className="p-2">
          <Button>Create Snippet</Button>
        </div>
      </Form>
    </div>
  );
};

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const token = session.get('token');

  if (!token) {
    return redirect('/login');
  }

  const supportedLangsResult = await getSupportedLanguages({ token });

  if (supportedLangsResult.data) {
    return { supportedLangs: supportedLangsResult.data };
  }

  return { error: supportedLangsResult.error };
}

export async function action({ request }: Route.ActionArgs) {
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

    if (postResult.error.type === 'server') {
      const { message, status } = postResult.error;
      return data({ error: { message: message, status: status } }, { status: status });
    }

    const { message, e } = postResult.error;
    return data({ error: { message, e } }, { status: 400 });
  }

  return data({ error: { message: 'Invalid data submitted' } }, { status: 400 });
}

function createSchema(langs: string[]) {
  const CreateSnippetFormSchema = z.object({
    language: z.enum(langs, 'The language must be selected'),
    code: z.string().nonempty(),
  });
  return CreateSnippetFormSchema;
}

export default SnippetsNewRoute;
