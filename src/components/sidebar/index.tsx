import { ReactNode } from 'react'
import Image from 'next/image';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  Drawer,
  DrawerContent,
  useColorModeValue,
  Text,
  useDisclosure,
  BoxProps,
  Center,
  FlexProps
} from '@chakra-ui/react'

import logoImg from '../../../public/images/veterinario.png'

import { FaRegCalendarAlt, FaStethoscope, FaClipboard, FaUserMd, FaPaw    } from 'react-icons/fa'


import {
  FiSettings,
  FiMenu
} from 'react-icons/fi'
import { IconType } from 'react-icons'

import Link from 'next/link'

interface LinkItemProps {
  nome: string;
  icon: IconType;
  route: string;
}



const LinkItems: Array<LinkItemProps> = [
  { nome: 'Agenda', icon: FaRegCalendarAlt, route: '/dashboard' },
  { nome: 'Serviços', icon: FaStethoscope, route: '/servicos' },
  { nome: 'Veterinario', icon: FaUserMd, route: '/veterinarios' },
  { nome: 'cadastro pet', icon: FaPaw, route: '/pet' },
  { nome: 'Minha Conta', icon: FiSettings, route: '/profile' },
  
]

export function Sidebar({ children }: { children: ReactNode }) {

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg="veterinario.900">
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />

      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
        onClose={onClose}
      >
        <DrawerContent>
          <SidebarContent onClose={() => onClose()} />
        </DrawerContent>
      </Drawer>

      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p={4}>
        {children}
      </Box>
    </Box>
  )
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      bg="veterinario.400"
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >

      <Flex h="20" alignItems="center" justifyContent="space-between" mx="8">
        <Link href="/dashboard">
          <Flex cursor="pointer" userSelect="none" flexDirection="row">
            <Center p={4}>
              <Image
                src={logoImg}
                quality={100}
                width={360}
                objectFit="fill"
                alt="Logo barberpro"
              />
            </Center>
          </Flex>
        </Link>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>

      {LinkItems.map(link => (
        <NavItem icon={link.icon} route={link.route} key={link.nome}>
          {link.nome}
        </NavItem>
      ))}

    </Box>
  )
}

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactNode;
  route: string;
}

const NavItem = ({ icon, children, route, ...rest }: NavItemProps) => {
  return (
    <Link href={route} style={{ textDecoration: 'none' }} >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'veterinario.900',
          color: 'white'
        }}
        {...rest}
      >

        {icon && (
          <Icon
            mr={4}
            fontSize="16"
            as={icon}
            _groupHover={{
              color: 'white'
            }}
          />
        )}
        {children}
      </Flex>
    </Link>
  )
}

interface MobileProps extends FlexProps{
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps ) => {
  return(
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={ <FiMenu/> }
      />
  
      <Flex flexDirection="row">
        <Text ml={8} fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="button.cta">
          Veterinário
        </Text>
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="button.cta">
          PRO
        </Text>
      </Flex>
    </Flex>
  )
}