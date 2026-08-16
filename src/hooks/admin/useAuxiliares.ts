import { useQuery } from '@tanstack/react-query';
import { getMarcas, getUnidades } from '../../services/admin/auxiliares.api';

export const useMarcas = () =>
  useQuery({ queryKey: ['admin', 'marcas'], queryFn: getMarcas });

export const useUnidades = () =>
  useQuery({ queryKey: ['admin', 'unidades'], queryFn: getUnidades });
