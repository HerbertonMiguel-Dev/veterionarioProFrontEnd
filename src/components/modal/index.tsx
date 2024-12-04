import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  Flex,
} from '@chakra-ui/react'

import { FiUser, FiScissors } from 'react-icons/fi'
import { FaPaw, FaUserMd, FaStethoscope } from 'react-icons/fa';
import IconCombo from '../../components/icon'

import { FaMoneyBillAlt } from 'react-icons/fa'
import { ConsultaItem } from '../../pages/dashboard'

interface ModalInfoProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  data: ConsultaItem;
  finishService: () => Promise<void>;
}

export function ModalInfo({ isOpen, onOpen, onClose, data, finishService }: ModalInfoProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="veterinario.400" maxW="640px">
        <ModalHeader>Próximo</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Flex align="center" mb={3}>
            <FaPaw size={28} color="#000" />
            <Text ml={3} fontSize="2xl" fontWeight="bold" color="white">
              <Text mr={2} as="span" color="#000" fontWeight="bold">
                Pet:
              </Text>
              {data?.pet?.nome}
            </Text>
          </Flex>

          <Flex align="center" mb={3}>
            <IconCombo size={`${28}px`} />
            <Text ml={3} fontSize="2xl" fontWeight="bold" color="white">
              <Text mr={2} as="span" color="#000" fontWeight="bold">
                Responsavel:
              </Text>
              {data?.responsavel?.nome}
            </Text>
          </Flex>

          <Flex align="center" mb={3}>
            <FaUserMd size={28} color="#000" />
            <Text ml={3} fontSize="2xl" fontWeight="bold" color="white">
              <Text mr={2} as="span" color="#000" fontWeight="bold">
                Veterinario:
              </Text>
              {data?.veterinario?.nome}
            </Text>
          </Flex>

          <Flex align="center" mb={3}>
            <FaStethoscope size={28} color="#000" />
            <Text ml={3} fontSize="large" fontWeight="bold" color="white">
              <Text mr={2} as="span" color="#000" fontWeight="bold">
                Serviço:
              </Text>
              {data?.servico?.nome}
            </Text>
          </Flex>

          <Flex align="center" mb={3}>
            <FaMoneyBillAlt size={28} color="#46ef75" />
            <Text ml={3} fontSize="large" fontWeight="bold" color="white">
              <Text mr={2} as="span" color="#000" fontWeight="bold">
                Valor:
              </Text>
              R$ {data?.servico?.preco}
            </Text>
          </Flex>

          <ModalFooter>
            <Button
              bg="button.cta"
              _hover={{ bg: '#FFb13e' }}
              color="#FFF"
              mr={3}
              onClick={() => finishService()}
            >
              Finalizar Serviço
            </Button>
          </ModalFooter>


        </ModalBody>

      </ModalContent>
    </Modal>
  )
}