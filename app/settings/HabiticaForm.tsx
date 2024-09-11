'use client';

import CommonButton from '@/app/_components/CommonButton';
import { Button, ButtonGroup, Input } from '@nextui-org/react';
import clsx from 'clsx';
import { useCallback, useState } from 'react';

export default function HabiticaForm() {
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const edit = useCallback(() => setEditMode(true), []);
  const save = useCallback(() => setEditMode(false), []);
  const cancel = useCallback(() => setEditMode(false), []);
  const togglePassword = useCallback(() => setShowPassword((prev) => !prev), []);

  return (
    <>
      <h2>Habitica</h2>
      <Input variant={editMode ? 'faded' : 'bordered'} label="User ID" disabled={!editMode} />
      <Input
        variant={editMode ? 'faded' : 'bordered'}
        label="API Key"
        disabled={!editMode}
        type={showPassword ? 'text' : 'password'}
        endContent={
          <Button onClick={togglePassword} isIconOnly>
            👁️
          </Button>
        }
      />
      <div className="self-end flex gap-1">
        <CommonButton className={clsx(editMode && 'hidden')} onClick={edit}>
          Edit
        </CommonButton>
        <CommonButton className={clsx(editMode || 'hidden')} onClick={cancel} color="danger">
          Cancel
        </CommonButton>
        <CommonButton className={clsx(editMode || 'hidden')} onClick={save}>
          Save
        </CommonButton>
      </div>
    </>
  );
}
