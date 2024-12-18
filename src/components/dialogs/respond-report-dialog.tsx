'use client';

import { RespondReportSchema, respondReportSchema } from '@/lib/form-schemas';
import { useRespondReport } from '@/mutations/use-respond-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { AutoAnimate } from '@jodd/auto-animate';
import { createStore } from '@jodd/snap';
import { CheckCheckIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

const useRespondReportDialog = createStore<{ isOpen: boolean; reportId: string | null }>(() => ({
  isOpen: false,
  reportId: null
}));

const onOpenChange = (isOpen: boolean) =>
  useRespondReportDialog.setState((state) => ({
    isOpen,
    reportId: isOpen ? state.reportId : null
  }));
export const openRespondReportDialog = (reportId: string) =>
  useRespondReportDialog.setState({ isOpen: true, reportId });
export const closeRespondReortDialog = () => onOpenChange(false);

export default function RespondReportDialog() {
  const { isOpen } = useRespondReportDialog();
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Respond to report</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden" />

        <BaseContent />
      </DialogContent>
    </Dialog>
  );
}

function BaseContent() {
  const reportId = useRespondReportDialog((state) => state.reportId);
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit
  } = useForm<RespondReportSchema>({ resolver: zodResolver(respondReportSchema) });

  const { mutate, isPending } = useRespondReport(reportId!);

  const onSubmit = handleSubmit((data) => {
    if (isPending) return;
    mutate(data, {
      onSuccess() {
        reset();
        closeRespondReortDialog();
      }
    });
  });

  return (
    <>
      <form onSubmit={onSubmit}>
        <AutoAnimate className="flex flex-col space-y-2">
          <Label id="response">Response</Label>
          <Textarea rows={6} {...register('response')} placeholder="Response message..." />
          {errors.response && <p className="text-sm text-rose-500">{errors.response.message}</p>}
        </AutoAnimate>
      </form>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="text">Cancel</Button>
        </DialogClose>
        <Button
          onClick={onSubmit}
          variant="secondary"
          Icon={CheckCheckIcon}
          disabled={isPending}
          loading={isPending}
        >
          Send Response
        </Button>
      </DialogFooter>
    </>
  );
}
