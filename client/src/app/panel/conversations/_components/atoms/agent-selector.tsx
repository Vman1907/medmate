import { useAgents } from '@/components/context/agents';
import ComboboxMultiselect from '@/components/ui/combobox-multiselect';

export default function AgentFilter({
	selected,
	onConfirm,
}: {
	selected: string[];
	onConfirm: (labels: string[]) => void;
}) {
	const { list: agents } = useAgents();

	return (
		<ComboboxMultiselect
			items={agents.map((tag) => {
				return {
					value: tag.name,
					label: tag.name,
				};
			})}
			onChange={onConfirm}
			value={selected}
			placeholder='Select Agent'
		/>
	);
}
